// import express from "express"
// const router=express.Router()
// import {Admin,Course} from "../models/Schema"
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken"
// const SECRET = "SECr3mm";
// import { JWTPayload,authenticateJwt } from "../middleware/auth";


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




import express from "express";
const router = express.Router();
import { authenticateJwt } from "../middleware/auth";
import {
  CreateCourse,
  DeleteCourse,
  GetAllCourses,
  LogIn,
  SignUp,
  UpdateCourse,
} from "../controllers/AdminController";

//signup route
router.post("/signup", SignUp);

//login
router.post("/login", LogIn);

//create course
router.post("/courses", authenticateJwt, CreateCourse);

//get all courses
router.get("/courses", authenticateJwt, GetAllCourses);

//update course
router.put("/courses/:courseId", authenticateJwt, UpdateCourse);

//delete course
router.delete("/courses/:courseId", authenticateJwt, DeleteCourse);

export default router;