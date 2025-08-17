const db = require("../Model/index");
const BookCourse = db.BookCourse;
const User = db.user;
const Package = db.Package;
const Sequelize = db.Sequelize;

const createBookCourse = async (req, res) => {
    try {
        const {
            package_id,
            experience,
            transmission,
            first_name,
            contact_no,
            license_number,
            email,
            addresses,
            addtional_information,
            have_you_been_ordered,
            preferred_start_date,
            instructor_id,
            status
        } = req.body;

        if (!package_id || !first_name || !contact_no || !email || !instructor_id) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        const addressArray = Array.isArray(addresses) ? addresses : [];

        const booking = await BookCourse.create({
            package_id,
            experience,
            transmission,
            first_name,
            contact_no,
            license_number,
            email,
            addresses: addressArray,
            addtional_information,
            have_you_been_ordered,
            preferred_start_date,
            instructor_id,
            status
        });

        res.status(201).json({
            success: true,
            message: "Course booking created successfully",
            data: booking
        });

    } catch (err) {
        console.error("Create Book Course Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getInstructorBookings = async (req, res) => {
    try {
        const { instructor_id } = req.params;

        const bookings = await BookCourse.findAll({
            where: { instructor_id },
            include: [
                {
                    model: User,
                    as: 'instructor',
                },
                { 
                    model: Package,
                    as: 'package' 
                }
            ]
        });

        if (!bookings.length) {
            return res.status(404).json({
                status: false,
                message: "No bookings found for this instructor"
            });
        }

        res.status(200).json({
            status: true,
            total_bookings: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Server error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id || !status) {
            return res.status(400).json({
                success: false,
                message: "Booking course ID and status are required."
            });
        }

        const booking = await BookCourse.findByPk(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        booking.status = status;
        await booking.save();

        return res.json({
            success: true,
            message: "Booking course status updated successfully.",
            data: booking
        });

    } catch (error) {
        console.error("Error updating booking status:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

const getTotalBookCourses = async (req, res) => {
  try {
    const totalCount = await BookCourse.count();

    const allData = await BookCourse.findAll({
      order: [["created_at", "DESC"]],
        include: [
            {
                model: User,
                as: 'instructor',
            },
            { 
                model: Package,
                as: 'package' 
            }
        ]
    });

    res.status(200).json({
      success: true,
      total_book_course: totalCount,
      data: allData
    });
  } catch (error) {
    console.error("Error fetching total book_course:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

const updateBookCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            package_id,
            experience,
            transmission,
            first_name,
            contact_no,
            license_number,
            email,
            addresses,
            addtional_information,
            have_you_been_ordered,
            preferred_start_date,
            instructor_id,
            status
        } = req.body;

        const booking = await BookCourse.findByPk(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "BookCourse record not found"
            });
        }

        const addressArray = Array.isArray(addresses) ? addresses : [];

        await booking.update({
            package_id,
            experience,
            transmission,
            first_name,
            contact_no,
            license_number,
            email,
            addresses: addressArray,
            addtional_information,
            have_you_been_ordered,
            preferred_start_date,
            instructor_id,
            status
        });

        res.status(200).json({
            success: true,
            message: "Course booking updated successfully",
            data: booking
        });

    } catch (err) {
        console.error("Update Book Course Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getStatusCounts = async (req, res) => {
    try {
        const counts = await BookCourse.findAll({
            attributes: [
                "status",
                [Sequelize.fn("COUNT", Sequelize.col("status")), "count"]
            ],
            group: ["status"]
        });

        const statusCounts = {
            pending: 0,
            confirmed: 0,
            cancelled: 0,
            completed: 0
        };

        counts.forEach(item => {
            statusCounts[item.status] = parseInt(item.dataValues.count, 10);
        });

        res.status(200).json({
            success: true,
            status_counts: statusCounts
        });

    } catch (error) {
        console.error("Error fetching status counts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    createBookCourse,
    getInstructorBookings,
    updateStatus,
    getTotalBookCourses,
    updateBookCourse,
    getStatusCounts
};
