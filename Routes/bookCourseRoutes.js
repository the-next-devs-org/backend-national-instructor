const express = require("express");
const router = express.Router();
const bookCourseController = require("../Controller/bookCourseController");
const verifyJWT = require("../middleware/authMiddleware");

router.post("/create", verifyJWT, bookCourseController.createBookCourse);
router.get('/instructor/:instructor_id/bookings', verifyJWT, bookCourseController.getInstructorBookings);
router.put("/status", verifyJWT, bookCourseController.updateStatus);
router.get("/total-book-course", verifyJWT, bookCourseController.getTotalBookCourses);
router.put("/update/:id", verifyJWT, bookCourseController.updateBookCourse);
router.get("/status-counts", verifyJWT, bookCourseController.getStatusCounts);

module.exports = router;
