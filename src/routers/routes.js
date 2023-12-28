const express=require('express')
const router=new express.Router()
const {Admin,User,Course} = require("../db/models/Schema");

const jwt = require('jsonwebtoken');




const SECRET = 'SECr3mm'; 

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };


  router.post('/admin/signup', async(req, res) => {
    const {username,password}=req.body;
    const admin= await Admin.findOne({username})
    if(admin){
      res.status(403).json({message:"admin already exsists"})
      
    }
    else{
      const newAdmin= new Admin({username,password})
      await newAdmin.save();
         // Generate JWT Token
         const token = jwt.sign(
          { username }, // Payload
          SECRET, // Secret key - replace with your actual secret key
          { expiresIn: '1h' } // Token expiration time
        );
    
        res.status(200).json({ message: "Admin created successfully", token });
    }
  });

  router.post('/admin/login',async(req,res)=>{
const{username,password}=req.headers;
const admin= await Admin.findOne({username,password})
if(admin){
  const token=jwt.sign(
    {username},
    SECRET,
    {expiresIn:'1h'}

  )
  res.status(200).json({message:"Admin logged in succesfully",token})
}
else{
  res.status(403).json({message:"Invlaid username,password"})
}

  })
  
  router.post('/admin/courses', authenticateJwt,async(req,res)=>{
    const{title,description,price,imageLink,published}=req.body
    const course= await Course.findOne({title})
    if(course){
      res.status(403).json({ message: "Course already exists" });
    }
    else{
      const newCourse=new Course({title,description,price,imageLink,published})
     await newCourse.save();
     res.status(200).json({ message: "Course created successfully", courseId: newCourse._id });// in mongodb course id is automatically generated we jut have to retrieve it
    }


  })
  router.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
      res.json({ message: 'Course updated successfully',course });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });
  router.get('/admin/courses', authenticateJwt, async (req, res) => {
    const courses = await Course.find({published:true});
  res.status(200).json({message:"all the courses",courses})
  });

  // User routes
router.post('/users/signup', async(req, res) => {
  
  const {username,password}=req.body
  const user= await User.findOne({username})
  if(user){
    res.status(403).json({message:"user already exsists"})
  }

  const newUser= new User({username,password})
  await newUser.save()
  const token = jwt.sign(
             { username }, // Payload
             SECRET, // Secret key - replace with your actual secret key
          { expiresIn: '1h' } // Token expiration time
       );
       res.status(200).json({message:"User created",token})
});

router.post('/users/login',async (req, res) => {
  const {username,password}=req.headers
  const user= await User.findOne({username,password})
  if(user){
   const token = jwt.sign(
     { username }, // Payload
     SECRET, // Secret key - replace with your actual secret key
     { expiresIn: '1h' } // Token expiration time
     
   );
   res.status(200).json({message:"logged in successfully",token})
  }
  else{
   res.status(403).json({message:"Invlaid username,password"})
  }
});

router.get('/users/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({published: true});
  res.status(200).json({message:"all the courses",courses})
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  console.log(course);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

module.exports=router;