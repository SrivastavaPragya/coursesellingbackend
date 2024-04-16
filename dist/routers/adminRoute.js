"use strict";
// import express from "express"
// const router=express.Router()
// import {Admin,Course} from "../models/Schema"
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken"
// const SECRET = "SECr3mm";
// import { JWTPayload,authenticateJwt } from "../middleware/auth";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Response,Request } from "express";
//login 
//signup
// post courses
// router.post('/courses',authenticateJwt,async(req:Request,res:Response)=>{
// })
//get all courses
// router.get('/courses',authenticateJwt,async(req:Request,res:Response)=>{
// })
//update courses
// router.put('/courses/:courseId', authenticateJwt, async (req: Request, res: Response) => {
// });
//delete courses
// router.delete('/courses/:courseId', authenticateJwt, async (req: Request, res: Response) => {
// });
// export default router
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const AdminController_1 = require("../controllers/AdminController");
//signup route
router.post("/signup", AdminController_1.SignUp);
//login
router.post("/login", AdminController_1.LogIn);
//create course
router.post("/courses", auth_1.authenticateJwt, AdminController_1.CreateCourse);
//get all courses
router.get("/courses", auth_1.authenticateJwt, AdminController_1.GetAllCourses);
//update course
router.put("/courses/:courseId", auth_1.authenticateJwt, AdminController_1.UpdateCourse);
//delete course
router.delete("/courses/:courseId", auth_1.authenticateJwt, AdminController_1.DeleteCourse);
exports.default = router;
