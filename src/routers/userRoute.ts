import express from "express";
const router = express.Router();
import { authenticateJwt } from "../middleware/auth";
import {
  GetAllPurchasedCourse,
  GetCategorizedCourses,
  GetPurchasedCourseFiltered,
  GetUserProfile,
  LogInUser,
  PurchaseCourse,
  SignUpUser,
  UpdateUserProfile,
} from "../controllers/UserController";

//signup user
router.post("/signup", SignUpUser);

//login user
router.post("/login", LogInUser);

//get user profile
router.get("/profile", authenticateJwt, GetUserProfile);

//updating user profile
router.put("/profile", authenticateJwt, UpdateUserProfile);

//purchasing course
router.post("/courses/:courseId", authenticateJwt, PurchaseCourse);

//getall purchased courses
router.get("/purchasedCourses", authenticateJwt, GetAllPurchasedCourse);

//get filtered puchased courses
router.get(
  "/purchasedCoursesFilter",
  authenticateJwt,
  GetPurchasedCourseFiltered
);

//get categorized courses
router.get("/courses", authenticateJwt, GetCategorizedCourses);

export default router;