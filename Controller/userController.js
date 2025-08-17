const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../Model/index');
const process = require('process');
const Package = db.Package;
const User = db.user;
require('dotenv').config();

const getLearners = async (req, res) => {
    try {
        const learners = await User.findAll({
            where: { role: 'learner' },
            include: [
                { 
                    model: Package,
                    as: 'package',
                }
            ]
        });

        return res.status(200).json({
            success: true,
            total_learners: learners.length,
            data: learners
        });
    } catch (error) {
        console.error("Error fetching learners:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getInstructors = async (req, res) => {
    try {
        const instructors = await User.findAll({
            where: { role: 'instructor' },
            include: [
                { 
                    model: Package,
                    as: 'package',
                }
            ]
        });

        return res.json({
            success: true,
            total_instructors: instructors.length,
            data: instructors
        });
    } catch (error) {
        console.error("Error fetching instructors:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// const editUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const {
//             email,
//             password,
//             first_name,
//             last_name,
//             role,
//             is_active,
//             i_want_to_be,
//             experience,
//             postcode,
//             prefered_transmission,
//             prefered_days,
//             prefered_time,
//             note,
//             phone,
//             package_id
//         } = req.body;

//         // User exist check
//         const user = await User.findByPk(id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // Role validation
//         if (role && !['learner', 'instructor', 'student'].includes(role)) {
//             return res.status(400).json({ success: false, message: 'Role must be learner or instructor or student' });
//         }

//         // Update fields
//         user.email = email ?? user.email;
//         user.password = password ?? user.password;
//         user.first_name = first_name ?? user.first_name;
//         user.last_name = last_name ?? user.last_name;
//         user.role = role ?? user.role;
//         user.is_active = is_active ?? user.is_active;
//         user.i_want_to_be = i_want_to_be ?? user.i_want_to_be;
//         user.experience = experience ?? user.experience;
//         user.postcode = postcode ?? user.postcode;
//         user.prefered_transmission = prefered_transmission ?? user.prefered_transmission;
//         user.prefered_days = prefered_days ?? user.prefered_days;
//         user.prefered_time = prefered_time ?? user.prefered_time;
//         user.note = note ?? user.note;
//         user.phone = phone ?? user.phone;
//         user.package_id = package_id ?? user.package_id;
//         user.updated_at = new Date();

//         await user.save();

//         return res.status(200).json({
//             success: true,
//             message: `${user.role} updated successfully`,
//             data: user
//         });
//     } catch (error) {
//         console.error("Error updating user:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };
const passwordMessage = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and be at least 8 characters long.";

const passwordSchema = Joi.string()
    .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .required()
    .messages({
        'string.pattern.base': passwordMessage,
        'string.empty': 'Password is required.'
    });

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            email,
            password,
            first_name,
            last_name,
            role,
            is_active,
            i_want_to_be,
            experience,
            postcode,
            prefered_transmission,
            prefered_days,
            prefered_time,
            note,
            phone,
            package_id
        } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (role && !['learner', 'instructor', 'student'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Role must be learner or instructor or student' });
        }

        if (password) {
            const { error } = passwordSchema.validate(password);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            user.password = password;
        }

        user.email = email ?? user.email;
        user.first_name = first_name ?? user.first_name;
        user.last_name = last_name ?? user.last_name;
        user.role = role ?? user.role;
        user.is_active = is_active ?? user.is_active;
        user.i_want_to_be = i_want_to_be ?? user.i_want_to_be;
        user.experience = experience ?? user.experience;
        user.postcode = postcode ?? user.postcode;
        user.prefered_transmission = prefered_transmission ?? user.prefered_transmission;
        user.prefered_days = prefered_days ?? user.prefered_days;
        user.prefered_time = prefered_time ?? user.prefered_time;
        user.note = note ?? user.note;
        user.phone = phone ?? user.phone;
        user.package_id = package_id ?? user.package_id;
        user.updated_at = new Date();

        await user.save();

        return res.status(200).json({
            success: true,
            message: `${user.role} updated successfully`,
            data: user
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    getLearners,
    getInstructors,
    editUser
};
