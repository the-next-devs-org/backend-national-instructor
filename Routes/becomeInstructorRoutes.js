const express = require('express');
const router = express.Router();
const { saveInstructor, getInstructorById, updateInstructor, getInstructorData, deleteInstructor, getallbecomeinstructors, upload } = require('../Controller/becomeInstructorController');
const verifyJWT = require("../middleware/authMiddleware");

router.get('/getallbecomeinstructors', verifyJWT, getallbecomeinstructors);

router.post('/create', verifyJWT, upload.fields([
    { name: 'driving_license', maxCount: 1 },
    { name: 'dvsa_adi_certificate', maxCount: 1 }
]), saveInstructor);

router.get('/:id', verifyJWT, getInstructorById);

router.put('/:id', verifyJWT, upload.fields([
    { name: 'driving_license', maxCount: 1 },
    { name: 'dvsa_adi_certificate', maxCount: 1 }
]), updateInstructor);

router.get('/instructor/:instructor_id', verifyJWT, getInstructorData);

router.delete('/deleteinstructor/:id', verifyJWT, deleteInstructor);

module.exports = router;
