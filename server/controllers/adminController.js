const User = require('../models/User');
const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const sendResponse = require('../utils/sendResponse');
const { AppError } = require('../middleware/errorMiddleware');

// @desc    Get admin overview stats
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: 'completed' });
    const pendingRides = await Ride.countDocuments({ status: 'pending' });
    const ongoingRides = await Ride.countDocuments({ status: 'ongoing' });
    const cancelledRides = await Ride.countDocuments({ status: 'cancelled' });

    // Revenue
    const revenueAgg = await Ride.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$fare' },
          avgFare: { $avg: '$fare' },
        },
      },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;
    const avgFare = revenueAgg.length > 0 ? Math.round(revenueAgg[0].avgFare) : 0;

    // Revenue by ride type
    const revenueByType = await Ride.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$rideType',
          revenue: { $sum: '$fare' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Revenue last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyRevenue = await Ride.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
          },
          revenue: { $sum: '$fare' },
          rides: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Ride.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$completedAt' },
          },
          revenue: { $sum: '$fare' },
          rides: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    sendResponse(res, 200, true, 'Admin stats fetched', {
      totalUsers,
      totalDrivers,
      totalAdmins,
      totalRides,
      completedRides,
      pendingRides,
      ongoingRides,
      cancelledRides,
      totalRevenue,
      avgFare,
      revenueByType,
      dailyRevenue,
      monthlyRevenue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get location analytics
// @route   GET /api/admin/locations
exports.getLocationStats = async (req, res, next) => {
  try {
    // Top pickup locations
    const topPickups = await Ride.aggregate([
      { $group: { _id: '$pickup.address', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Top drop-off locations
    const topDropoffs = await Ride.aggregate([
      { $group: { _id: '$dropoff.address', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Top routes (pickup → dropoff)
    const topRoutes = await Ride.aggregate([
      {
        $group: {
          _id: {
            pickup: '$pickup.address',
            dropoff: '$dropoff.address',
          },
          count: { $sum: 1 },
          avgFare: { $avg: '$fare' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    sendResponse(res, 200, true, 'Location stats fetched', {
      topPickups,
      topDropoffs,
      topRoutes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rides (admin)
// @route   GET /api/admin/rides
exports.getAllRides = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const rideType = req.query.rideType;
    const search = req.query.search;

    const filter = {};
    if (status) filter.status = status;
    if (rideType) filter.rideType = rideType;
    if (search) {
      filter.$or = [
        { 'pickup.address': { $regex: search, $options: 'i' } },
        { 'dropoff.address': { $regex: search, $options: 'i' } },
      ];
    }

    const rides = await Ride.find(filter)
      .populate('user', 'name email phone')
      .populate('driver')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ride.countDocuments(filter);

    sendResponse(res, 200, true, 'All rides fetched', {
      rides,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a ride (admin)
// @route   PUT /api/admin/rides/:id
exports.updateRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return next(new AppError('Ride not found', 404));
    }

    const allowedFields = [
      'status',
      'fare',
      'rideType',
      'paymentMethod',
      'paymentStatus',
      'rating',
      'pickup',
      'dropoff',
      'distance',
      'duration',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        ride[field] = req.body[field];
      }
    });

    if (req.body.status === 'completed' && !ride.completedAt) {
      ride.completedAt = new Date();
    }
    if (req.body.status === 'ongoing' && !ride.startedAt) {
      ride.startedAt = new Date();
    }

    await ride.save();

    const updated = await Ride.findById(ride._id)
      .populate('user', 'name email phone')
      .populate('driver');

    sendResponse(res, 200, true, 'Ride updated', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a ride (admin)
// @route   DELETE /api/admin/rides/:id
exports.deleteRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return next(new AppError('Ride not found', 404));
    }

    await ride.deleteOne();
    sendResponse(res, 200, true, 'Ride deleted');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const role = req.query.role;
    const search = req.query.search;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    sendResponse(res, 200, true, 'All users fetched', {
      users,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (admin)
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'driver', 'admin'].includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    if (user._id.toString() === req.user._id.toString()) {
      return next(new AppError('Cannot change your own role', 400));
    }

    user.role = role;
    await user.save();

    sendResponse(res, 200, true, 'User role updated', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    if (user._id.toString() === req.user._id.toString()) {
      return next(new AppError('Cannot delete yourself', 400));
    }

    await user.deleteOne();
    sendResponse(res, 200, true, 'User deleted');
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status (admin)
// @route   PUT /api/admin/users/:id/toggle-active
exports.toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    if (user._id.toString() === req.user._id.toString()) {
      return next(new AppError('Cannot deactivate yourself', 400));
    }

    user.isActive = !user.isActive;
    await user.save();

    sendResponse(res, 200, true, `User ${user.isActive ? 'activated' : 'deactivated'}`, {
      id: user._id,
      name: user.name,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};
