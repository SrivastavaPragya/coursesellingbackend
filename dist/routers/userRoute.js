"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const UserController_1 = require("../controllers/UserController");
//signup user
router.post("/signup", UserController_1.SignUpUser);
//login user
router.post("/login", UserController_1.LogInUser);
//get user profile
router.get("/profile", auth_1.authenticateJwt, UserController_1.GetUserProfile);
//updating user profile
router.put("/profile", auth_1.authenticateJwt, UserController_1.UpdateUserProfile);
//purchasing course
router.post("/courses/:courseId", auth_1.authenticateJwt, UserController_1.PurchaseCourse);
//getall purchased courses
router.get("/purchasedCourses", auth_1.authenticateJwt, UserController_1.GetAllPurchasedCourse);
//get filtered puchased courses
router.get("/purchasedCoursesFilter", auth_1.authenticateJwt, UserController_1.GetPurchasedCourseFiltered);
//get categorized courses
router.get("/courses", auth_1.authenticateJwt, UserController_1.GetCategorizedCourses);
exports.default = router;
