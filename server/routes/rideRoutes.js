const express = require('express');
const router = express.Router();
const {
  bookRide,
  getRides,
  getRide,
  cancelRide,
  rateRide,
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, bookRide);
router.get('/', protect, getRides);
router.get('/:id', protect, getRide);
router.put('/:id/cancel', protect, cancelRide);
router.put('/:id/rate', protect, rateRide);

module.exports = router;
