import mongoose from "mongoose";
import validator from 'validator'
import bcrypt from "bcryptjs"

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(email: string) {
                return validator.isEmail(email);
            },
            message: (props: { value: string }) => `${props.value} is not a valid email!`
        },
    },
    
    
    password: {
        type: String,
        required: true,
      
    },
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]



})


const AdminSchema= new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
     validate: {
        validator: function(email: string) {
            return validator.isEmail(email);
        },
        message: (props: { value: string }) => `${props.value} is not a valid email!`
    },

    
},


password:{
    type:String,
    required:true,
    minlength: 7,

}
})

const CourseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imageLink:{
       type:String,
        required:true
    },
    type:
     {
         type: String,
          required: true
         },
    level: 
    {
         type: String,
          required: true 
        },
        
        category:{
            type:String,
            required:true
        }


})

export const User = mongoose.model('User', userSchema);
export const Admin=mongoose.model('Admin',AdminSchema);
export const Course=mongoose.model('Course',CourseSchema);