const express = require("express");
const router = express.Router();
const packageController = require("../Controller/packageController");
const verifyJWT = require("../Middleware/authMiddleware");

router.post("/createpackage", verifyJWT, packageController.createPackage);

router.get("/getpackages", verifyJWT, packageController.getPackages);

router.get("/getpackagebyid/:id", verifyJWT, packageController.getPackageById);

router.put("/updatepackage/:id", verifyJWT, packageController.updatePackage);

router.delete("/deletepackage/:id", verifyJWT, packageController.deletePackage);

module.exports = router;
