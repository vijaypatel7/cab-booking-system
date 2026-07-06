const User = require('../models/User');
const Ride = require('../models/Ride');
const sendResponse = require('../utils/sendResponse');
const { AppError } = require('../middleware/errorMiddleware');

// @desc    Get all users (admin)
// @route   GET /api/users
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    sendResponse(res, 200, true, 'Users fetched', {
      users,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
exports.getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalRides = await Ride.countDocuments({ user: userId });
    const completedRides = await Ride.countDocuments({
      user: userId,
      status: 'completed',
    });
    const cancelledRides = await Ride.countDocuments({
      user: userId,
      status: 'cancelled',
    });

    const fareAgg = await Ride.aggregate([
      { $match: { user: userId, status: 'completed' } },
      { $group: { _id: null, totalFare: { $sum: '$fare' } } },
    ]);

    const totalSpent = fareAgg.length > 0 ? fareAgg[0].totalFare : 0;

    sendResponse(res, 200, true, 'Stats fetched', {
      totalRides,
      completedRides,
      cancelledRides,
      totalSpent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await user.deleteOne();
    sendResponse(res, 200, true, 'User deleted');
  } catch (error) {
    next(error);
  }
};
