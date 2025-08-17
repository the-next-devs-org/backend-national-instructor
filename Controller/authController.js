const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../Model/index');
const process = require('process');
const Package = db.Package;
require('dotenv').config();

const User = db.user;

const message =
    "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and be at least 8 characters long.";

const createJWTToken = (user_id, email) => {
    return jwt.sign({ user_id, email }, process.env.JWT_SECRET, {
        expiresIn: "12h",
    });
};
//test
// const registerScheme = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string()
//         .regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
//         .message(message)
//         .required(),
//     first_name: Joi.string().required(),
//     last_name: Joi.string().required(),
//     role: Joi.string().optional()
// });

const registerScheme = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } }) // TLD check disable for test emails
        .required()
        .messages({
            'string.email': 'Please provide a valid email address.',
            'string.empty': 'Email is required.',
        }),
    password: Joi.string()
        .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
        .required()
        .messages({
            'string.pattern.base': message,
            'string.empty': 'Password is required.',
        }),
    first_name: Joi.string().required().messages({
        'string.empty': 'First name is required.',
    }),
    last_name: Joi.string().required().messages({
        'string.empty': 'Last name is required.',
    }),
    role: Joi.string().optional(),
    i_want_to_be: Joi.string().optional(),
});

const loginScheme = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
        .message(message)
        .required(),
    rememberMe: Joi.boolean().optional()
});

// const register = async (req, res) => {
//     try {
//         const { error, value } = registerScheme.validate(req.body);
//         if (error) {
//             return res.status(400).json({ error: error.message });
//         }

//         const { email, password, first_name, last_name, role } = value;

//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ error: "User with this email already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = await User.create({
//             username: `${first_name}${last_name}`, // Auto create username
//             email,
//             first_name,
//             last_name,
//             password: hashedPassword,
//             role: role || "User",
//             active: true,
//         });

//         const token = createJWTToken(newUser.id, newUser.email);

//         res.status(201).json({
//             message: "Registration successful",
//             user: {
//                 id: newUser.id,
//                 username: newUser.username,
//                 email: newUser.email,
//                 first_name: newUser.first_name,
//                 last_name: newUser.last_name,
//             },
//             token,
//         });
//     } catch (error) {
//         console.error("Error in registration:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

const register = async (req, res) => {
    try {
        const { error, value } = registerScheme.validate(req.body, { abortEarly: false }); 
        if (error) {
            return res.status(400).json({
                error: error.details.map(err => err.message) // saare validation errors ek saath bhejne ke liye
            });
        }

        const { email, password, first_name, last_name, role,i_want_to_be } = value;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: `${first_name}${last_name}`,
            email,
            first_name,
            last_name,
            password: hashedPassword,
            role: role || "learner",
            i_want_to_be: i_want_to_be,
            active: true,
        });

        const token = createJWTToken(newUser.id, newUser.email);

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                i_want_to_be: newUser.i_want_to_be,
                role: newUser.role,
            },
            token,
        });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const insertPostalAndTransmission = async (req, res) => {
    try {
        const { user_id, postcode, prefered_transmission } = req.body;

        if (!user_id || !postcode || !prefered_transmission) {
            return res.status(400).json({ error: "user_id, postcode, and prefered_transmission are required" });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.postcode = postcode;
        user.prefered_transmission = prefered_transmission;
        await user.save();

        res.status(200).json({
            message: "Step first inserted successfully",
            user: {
                id: user.id,
                email: user.email,
                postcode: user.postcode,
                prefered_transmission: user.prefered_transmission,
            }
        });

    } catch (error) {
        console.error("Error inserting post code and prefered_transmission:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const insertexperience = async (req, res) => {
    try {
        const { user_id, experience } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        // if (!['complete_beginner', 'some_experience', 'test_ready'].includes(experience)) {
        //     return res.status(400).json({ error: "Invalid experience value" });
        // }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.experience = experience;
        await user.save();

        res.status(200).json({
            message: "Step second inserted successfully",
            user: {
                id: user.id,
                experience: user.experience
            }
        });

    } catch (error) {
        console.error("Error insert experience:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const insertPackageId = async (req, res) => {
    try {
        const { user_id, package_id } = req.body;

        if (!user_id || !package_id) {
            return res.status(400).json({ error: "user_id and package_id are required" });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.package_id = package_id;
        await user.save();

        res.status(200).json({
            message: "Step third inserted successfully",
            user: {
                id: user.id,
                email: user.email,
                package_id: user.package_id
            }
        });

    } catch (error) {
        console.error("Error insert package_id:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const insertPreferences = async (req, res) => {
    try {
        const { user_id, prefered_days, prefered_time, note } = req.body;

        if (!user_id || !Array.isArray(prefered_days) || prefered_days.length === 0 || 
            !Array.isArray(prefered_time) || prefered_time.length === 0) {
            return res.status(400).json({ 
                error: "user_id, prefered_days, and prefered_time are required" 
            });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.prefered_days = JSON.stringify(prefered_days);
        user.prefered_time = JSON.stringify(prefered_time);
        user.note = note || null; 

        await user.save();

        res.status(200).json({
            message: "Step fourth inserted successfully",
            user: {
                id: user.id,
                email: user.email,
                prefered_days: JSON.parse(user.prefered_days),
                prefered_time: JSON.parse(user.prefered_time),
                note: user.note
            }
        });

    } catch (error) {
        console.error("Error insert preferences:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const insertPhone = async (req, res) => {
    try {
        const { user_id, phone } = req.body;

        if (!user_id || !phone) {
            return res.status(400).json({ error: "user_id and phone are required" });
        }

        if (isNaN(phone)) {
            return res.status(400).json({ error: "Phone must be a number" });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.phone = phone;
        await user.save();

        res.status(200).json({
            message: "Step fifth inserted successfully",
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error("Error insert phone:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const fieldsToUpdate = {};
        const allowedFields = [
            "email",
            "first_name",
            "last_name",
            "i_want_to_be",
            "experience",
            "postcode",
            "prefered_transmission",
            "prefered_days",
            "prefered_time",
            "note",
            "phone"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === "prefered_days" || field === "prefered_time") {
                    fieldsToUpdate[field] = JSON.stringify(req.body[field]);
                } else {
                    fieldsToUpdate[field] = req.body[field];
                }
            }
        });

        await user.update(fieldsToUpdate);

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });

    } catch (err) {
        console.error("Update Profile Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const viewProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({
            where: { id },
            include: [
                {
                    model: Package,
                    as: 'package',
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            status: true,
            message: "Profile fetched successfully",
            data: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



const login = async (req, res) => {
    try {
        const { error, value } = loginScheme.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const { email, password } = value;

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // if (!existingUser.email_verify) {
        //     return res.status(403).json({ error: "Email is not verified" });
        // }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = createJWTToken(existingUser.id, existingUser.email);
        res.status(200).json({ status: 200, message: "Login successful", token, role: existingUser.role });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    register,
    login,
    insertexperience,
    insertPostalAndTransmission,
    insertPackageId,
    insertPreferences,
    insertPhone,
    updateUser,
    viewProfile
};
