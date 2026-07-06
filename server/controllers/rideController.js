const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const sendResponse = require('../utils/sendResponse');
const { AppError } = require('../middleware/errorMiddleware');

// @desc    Book a new ride
// @route   POST /api/rides
exports.bookRide = async (req, res, next) => {
  try {
    const {
      pickup,
      dropoff,
      fare,
      distance,
      duration,
      rideType,
      paymentMethod,
    } = req.body;

    const ride = await Ride.create({
      user: req.user._id,
      pickup,
      dropoff,
      fare,
      distance,
      duration,
      rideType,
      paymentMethod,
    });

    // Try to auto-assign a nearby driver
    const availableDriver = await Driver.findOne({
      isAvailable: true,
      isVerified: true,
    });

    if (availableDriver) {
      ride.driver = availableDriver._id;
      ride.status = 'accepted';
      await ride.save();

      availableDriver.isAvailable = false;
      await availableDriver.save();
    }

    const populatedRide = await Ride.findById(ride._id)
      .populate('user', 'name email phone')
      .populate('driver');

    sendResponse(res, 201, true, 'Ride booked successfully', populatedRide);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rides for current user
// @route   GET /api/rides
exports.getRides = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const rides = await Ride.find(filter)
      .populate('driver')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ride.countDocuments(filter);

    sendResponse(res, 200, true, 'Rides fetched', {
      rides,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ride
// @route   GET /api/rides/:id
exports.getRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('driver');

    if (!ride) {
      return next(new AppError('Ride not found', 404));
    }

    sendResponse(res, 200, true, 'Ride fetched', ride);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a ride
// @route   PUT /api/rides/:id/cancel
exports.cancelRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return next(new AppError('Ride not found', 404));
    }

    if (ride.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized', 403));
    }

    if (ride.status === 'completed') {
      return next(new AppError('Cannot cancel a completed ride', 400));
    }

    ride.status = 'cancelled';
    ride.cancelledBy = 'user';
    ride.cancelReason = req.body.reason || 'No reason provided';

    // Free up the driver if assigned
    if (ride.driver) {
      const driver = await Driver.findById(ride.driver);
      if (driver) {
        driver.isAvailable = true;
        await driver.save();
      }
    }

    await ride.save();

    sendResponse(res, 200, true, 'Ride cancelled', ride);
  } catch (error) {
    next(error);
  }
};

// @desc    Rate a ride
// @route   PUT /api/rides/:id/rate
exports.rateRide = async (req, res, next) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return next(new AppError('Rating must be between 1 and 5', 400));
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return next(new AppError('Ride not found', 404));
    }

    if (ride.status !== 'completed') {
      return next(new AppError('Can only rate completed rides', 400));
    }

    ride.rating = rating;
    await ride.save();

    // Update driver's average rating
    if (ride.driver) {
      const driverRides = await Ride.find({
        driver: ride.driver,
        rating: { $exists: true },
      });
      const avgRating =
        driverRides.reduce((sum, r) => sum + r.rating, 0) / driverRides.length;
      await Driver.findByIdAndUpdate(ride.driver, { rating: avgRating });
    }

    sendResponse(res, 200, true, 'Rating submitted', ride);
  } catch (error) {
    next(error);
  }
};
