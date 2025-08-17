const express = require("express");
const router = express.Router();

const userController = require("../Controller/userController");
const VerifyJWTtoken = require('../Middleware/authMiddleware.js')

router.get("/learners", VerifyJWTtoken, userController.getLearners);
router.get("/instructors", VerifyJWTtoken, userController.getInstructors);
router.put('/edit/:id', VerifyJWTtoken, userController.editUser);

module.exports = router;
