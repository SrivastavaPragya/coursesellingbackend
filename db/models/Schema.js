const mongoose=require("mongoose")
// Define mongoose schemas


const userSchema = new mongoose.Schema({
    username: {type: String},
    password: String,
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]// whenever I have to relate data between connections then we use this syntax
  });
  
  const adminSchema = new mongoose.Schema({
    username: String,
    password: String
  });
  
  const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
  });
  
  // Define mongoose models
  const User = mongoose.model('User', userSchema);
  const Admin = mongoose.model('Admin', adminSchema);
  const Course = mongoose.model('Course', courseSchema);
  // Export the models
module.exports = {
    User,
    Admin,
    Course
};