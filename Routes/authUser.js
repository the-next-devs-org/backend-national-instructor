const authController = require('../Controller/authController');
const VerifyJWTtoken = require('../middleware/authMiddleware.js')

const router = require("express").Router();

router.post("/Register" , authController.register);
router.post("/login" , authController.login);
router.post("/secondstep", VerifyJWTtoken, authController.insertexperience);
router.post("/firststep", VerifyJWTtoken, authController.insertPostalAndTransmission);
router.post("/thirdstep", VerifyJWTtoken, authController.insertPackageId);
router.post("/fourthstep", VerifyJWTtoken, authController.insertPreferences);
router.post("/fifthstep", VerifyJWTtoken, authController.insertPhone);
router.put("/updateuser/:id", VerifyJWTtoken, authController.updateUser);
router.get('/profile/:id', VerifyJWTtoken, authController.viewProfile);


module.exports = router;