const { Package } = require("../Model/index");

exports.createPackage = async (req, res) => {
    try {
        const {
            name,
            description,
            hours,
            price,
            price_per_hour,
            duration,
            lessons,
            test,
            features,
            course
        } = req.body;

        if (!name || !hours || !price || !price_per_hour) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        const pkg = await Package.create({
            name,
            description,
            hours,
            price,
            price_per_hour,
            duration,
            lessons,
            test,
            features: Array.isArray(features) ? features : [], // ensure array
            course
        });

        res.status(201).json({
            success: true,
            message: "Package created successfully",
            data: pkg
        });

    } catch (err) {
        console.error("Create Package Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.findAll();

        res.json({
            success: true,
            message: "Packages fetched successfully",
            data: packages
        });

    } catch (err) {
        console.error("Get Packages Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findByPk(req.params.id);

        if (!pkg) {
            return res.status(404).json({
                success: false,
                message: "Package not found"
            });
        }

        res.json({
            success: true,
            message: "Package fetched successfully",
            data: pkg
        });

    } catch (err) {
        console.error("Get Package By ID Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updatePackage = async (req, res) => {
    try {
        const pkg = await Package.findByPk(req.params.id);

        if (!pkg) {
            return res.status(404).json({
                success: false,
                message: "Package not found"
            });
        }

        if (req.body.features && !Array.isArray(req.body.features)) {
            return res.status(400).json({
                success: false,
                message: "Features must be an array"
            });
        }

        await pkg.update(req.body);

        res.json({
            success: true,
            message: "Package updated successfully",
            data: pkg
        });

    } catch (err) {
        console.error("Update Package Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deletePackage = async (req, res) => {
    try {
        const pkg = await Package.findByPk(req.params.id);

        if (!pkg) {
            return res.status(404).json({
                success: false,
                message: "Package not found"
            });
        }

        await pkg.destroy();

        res.json({
            success: true,
            message: "Package deleted successfully"
        });

    } catch (err) {
        console.error("Delete Package Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
