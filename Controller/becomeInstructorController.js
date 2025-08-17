const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../Model/index');
const BecomeInstructor = db.BecomeADrivingInstructor;

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.fieldname + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const saveInstructor = async (req, res) => {
    try {
        const { full_name, email_address, phone, home_address, training_qualification, instructor_id } = req.body;

        if (!full_name || !email_address || !phone || !home_address || !training_qualification || !instructor_id) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_address)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        const existingInstructor = await BecomeInstructor.findOne({ where: { email_address } });
        if (existingInstructor) {
            return res.status(409).json({ success: false, message: "Email address already exists" });
        }

        // if (!['dvsa training', 'first aid certification'].includes(training_qualification.toLowerCase())) {
        //     return res.status(400).json({ success: false, message: 'Invalid training qualification' });
        // }

        const driving_license = req.files?.driving_license?.[0]?.filename || null;
        const dvsa_adi_certificate = req.files?.dvsa_adi_certificate?.[0]?.filename || null;

        const data = await BecomeInstructor.create({
            full_name,
            email_address,
            phone,
            home_address,
            driving_license,
            dvsa_adi_certificate,
            training_qualification,
            instructor_id
        });

        return res.status(201).json({
            success: true,
            message: "Instructor application saved successfully",
            data
        });

    } catch (error) {
        console.error("Error saving instructor:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getInstructorById = async (req, res) => {
    try {
        const { id } = req.params;

        const instructor = await BecomeInstructor.findByPk(id, {
            include: [{ model: db.user, as: 'instructor' }] // if you want related user
        });

        if (!instructor) {
            return res.status(404).json({ success: false, message: "Instructor not found" });
        }

        return res.status(200).json({ success: true, data: instructor });

    } catch (error) {
        console.error("Error fetching instructor:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateInstructor = async (req, res) => {
    try {
        const { id } = req.params;

        const instructor = await BecomeInstructor.findByPk(id);
        if (!instructor) {
            return res.status(404).json({ success: false, message: "Instructor not found" });
        }

        const { full_name, email_address, phone, home_address, training_qualification, status } = req.body;

        if (email_address) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email_address)) {
                return res.status(400).json({ success: false, message: "Invalid email format" });
            }
        }

        // file uploads (optional update)
        const driving_license = req.files?.driving_license?.[0]?.filename || instructor.driving_license;
        const dvsa_adi_certificate = req.files?.dvsa_adi_certificate?.[0]?.filename || instructor.dvsa_adi_certificate;

        await instructor.update({
            full_name: full_name || instructor.full_name,
            email_address: email_address || instructor.email_address,
            phone: phone || instructor.phone,
            home_address: home_address || instructor.home_address,
            training_qualification: training_qualification || instructor.training_qualification,
            driving_license,
            dvsa_adi_certificate,
            status,
        });

        return res.status(200).json({ success: true, message: "Instructor updated successfully", data: instructor });

    } catch (error) {
        console.error("Error updating instructor:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getInstructorData = async (req, res) => {
    try {
        const { instructor_id } = req.params;

        const data = await db.BecomeADrivingInstructor.findAll({
            where: { instructor_id },
            include: [
                {
                    model: db.user,
                    as: "instructor",
                }
            ]
        });

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "No data found for this instructor" });
        }

        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await db.BecomeADrivingInstructor.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Instructor record not found"
            });
        }

        res.json({
            success: true,
            message: "Instructor record deleted successfully"
        });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error while deleting record"
        });
    }
};

const getallbecomeinstructors = async (req, res) => {
    try {
        const data = await BecomeInstructor.findAll({
            include: [
                {
                    model: db.user,
                    as: 'instructor',
                }
            ]
        });

        res.json({
            success: true,
            data
        });
    } catch (err) {
        console.error("Get All Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error while fetching records"
        });
    }
};

module.exports = { saveInstructor, getInstructorById, updateInstructor, getInstructorData, deleteInstructor, getallbecomeinstructors, upload };
