import { Request, Response, NextFunction } from "express";

import { Admin, Course } from "../models/Schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const SECRET = "SECr3mm";


export const SignUp=async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    try{
        const {email,name,password}=req.body
        const admin=await  Admin.findOne({email});
        if(admin){
          
            res.status(403).json({message:"Admin Already exsists"})
        }
        else{
             const hashedPassword = await bcrypt.hash(password, 10);
                  const newAdmin = new Admin({ name,email, password: hashedPassword });
                  await newAdmin.save();
                  
                  res.status(200).json({ message: "Admin created successfully"});
        }
    }
    catch(error){
        res.status(500).json({ message: "Internal server error"});
    }
      
}



export const LogIn=async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    try{
        const {email ,password}=req.body;
        const admin=await Admin.findOne({email});
        if(!admin){
            return res.status(403).json({ message: "Invalid email or password" });
        }
        const isPasswordCorrect=await bcrypt.compare(password,admin.password)
        if(isPasswordCorrect){
        const token=jwt.sign({id:admin._id,email:admin.email},SECRET,{expiresIn:'1h'});
        res.status(200).json({ message: "User logged in successfully", token });
        }
        else{
            res.status(403).json({message:"Invalid username and password"})
        }
    }
    catch(error){
        res.status(500).json({ message: "Internal server error"});
    }
}



export const CreateCourse=async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    try{
        const {title,description,imageLink,price,category,level,type}=req.body;

        const course=await Course.findOne({title})
        if(course){
            res.status(403).json({message:"Course already exsists"})
        }
        else{
    const newCourse=new Course({title,description,price,imageLink,category,level,type});
    await newCourse.save()
    res.status(200).json({ message: "Course created successfully", courseId: newCourse._id });
        }
    }catch (error){
        res.status(500).json({ message: "Internal server error"});
    }
}



export const GetAllCourses=async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    const courses=await Course.find();
    res.status(200).json({message:"all the courses",courses})
}


export const UpdateCourse=async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    const { courseId } = req.params;
    const updates = req.body; 

    try {
        
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updates, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: "Internal server error"});
    }
}



export const DeleteCourse=async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    const { courseId } = req.params;

    try {
        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
          
            return res.status(404).json({ message: "Course not found" });
        }

     
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      
        res.status(500).json({ message: "Internal server error"});
    }
}