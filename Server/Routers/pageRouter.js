const authController = require('./../Controllers/authController');
const express = require('express');
const router = express.Router();

router.get('/getAllUser', authController.protectRoutes, authController.getAllUser);
router.post('/signup', authController.signup);
router.post('/login', authController.logIn);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;
