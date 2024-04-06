import express from "express"
const router = express.Router()
import { User, Course } from "../db/models/Schema"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
const SECRET = "SECr3mm";


import { authenticateJwt, JWTPayload } from "../middleware/auth"
import { Response, Request } from "express";


router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(403).json({ message: "User already exists" }); // Return here to stop execution
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();
            
              res.status(200).json({ message: 'Signup successful!' });
            
        }
    } catch (error) {
        // Make sure to log the error for debugging purposes
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(403).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "User logged in successfully", token });
    } else {
        res.status(403).json({ message: "Invalid email or password" });
    }
});

router.get('/profile', authenticateJwt, async (req: Request & { user?: JWTPayload }, res: Response) => {
    if (!req.user) {
        return res.status(404).json({ message: "User does not exsist" })
    }
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
})



// Profile updating endpoint
router.put('/profile', authenticateJwt, async (req: Request & { user?: JWTPayload }, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "'Unauthorized'" })
    }
    const userId = req.user.id;
    const updates = req.body;

    try {

        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/courses/:courseId', authenticateJwt, async (req: Request & { user?: JWTPayload }, res: Response) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (course) {
        if (req.user && req.user.id) {
            const user = await User.findById(req.user.id);

            if (user) {
                // Check if the course is already purchased
                if (user.purchasedCourses.includes(course._id)) {
                    return res.status(400).json({ message: 'Course already purchased' });
                }

                // Add the course to the user's purchasedCourses and save
                user.purchasedCourses.push(course._id);
                await user.save();
                res.json({ message: 'Course purchased successfully' });
            } else {
                res.status(403).json({ message: 'User not found' });
            }
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

router.get('/purchasedCourses', authenticateJwt, async (req: Request & { user?: JWTPayload }, res: Response) => {
    if (req.user && req.user.id) {
        // Find the user by ID and populate the 'purchasedCourses' field
        const user = await User.findById(req.user.id).populate('purchasedCourses');

        if (user) {
            res.json({ purchasedCourses: user.purchasedCourses || [] });
        } else {
            res.status(403).json({ message: 'User not found' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});


router.get('/purchasedCoursesFilter', authenticateJwt, async (req: Request & { user?: JWTPayload }, res: Response) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title } = req.query;

    try {

        const filterOptions = title ? { title: { $regex: new RegExp(title as string, 'i') } } : {};

        const user = await User.findById(req.user.id).populate({
            path: 'purchasedCourses',
            match: filterOptions,
        });

        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }


        res.json({ purchasedCourses: user.purchasedCourses });
    } catch (error) {
        console.error("Error fetching purchased courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Assuming Course and JWTPayload are correctly imported
// And authenticateJwt middleware is available and imported

router.get('/courses', authenticateJwt, async (req: Request & { user?: JWTPayload }, res: Response) => {
    try {

        if (req.user && req.user.id) {
            const user = await User.findById(req.user.id)
            if (user) {
                const filterOptions: any = {};

                if (req.query.category) {
                    filterOptions.category = req.query.category; // Filters courses by category
                }
                if (req.query.level) {
                    filterOptions.level = req.query.level; // Filters courses by level
                }
                if (req.query.type) {
                    filterOptions.level = req.query.type
                }

                // Fetch courses based on the constructed filter options
                const courses = await Course.find(filterOptions);
                res.json({ courses });
            } else {
                res.status(404).json({ message: "User not found" })
            }
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }

    } catch (error) {
        console.error("Error fetching purchased courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }

});



export default router