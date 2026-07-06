const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAdminStats,
  getLocationStats,
  getAllRides,
  updateRide,
  deleteRide,
  getAllUsers,
  updateUserRole,
  deleteUser,
  toggleUserActive,
} = require('../controllers/adminController');

// All routes require admin role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/locations', getLocationStats);
router.get('/rides', getAllRides);
router.put('/rides/:id', updateRide);
router.delete('/rides/:id', deleteRide);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-active', toggleUserActive);

module.exports = router;
