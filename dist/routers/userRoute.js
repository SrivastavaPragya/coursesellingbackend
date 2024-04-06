"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Schema_1 = require("../db/models/Schema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = "SECr3mm";
const auth_1 = require("../middleware/auth");
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const user = yield Schema_1.User.findOne({ email });
        if (user) {
            return res.status(403).json({ message: "User already exists" }); // Return here to stop execution
        }
        else {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newUser = new Schema_1.User({ name, email, password: hashedPassword });
            yield newUser.save();
            res.status(200).json({ message: 'Signup successful!' });
        }
    }
    catch (error) {
        // Make sure to log the error for debugging purposes
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield Schema_1.User.findOne({ email });
    if (!user) {
        return res.status(403).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
    if (isPasswordCorrect) {
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "User logged in successfully", token });
    }
    else {
        res.status(403).json({ message: "Invalid email or password" });
    }
}));
router.get('/profile', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(404).json({ message: "User does not exsist" });
    }
    const userId = req.user.id;
    try {
        const user = yield Schema_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
}));
// Profile updating endpoint
router.put('/profile', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "'Unauthorized'" });
    }
    const userId = req.user.id;
    const updates = req.body;
    try {
        const user = yield Schema_1.User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post('/courses/:courseId', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const course = yield Schema_1.Course.findById(courseId);
    if (course) {
        if (req.user && req.user.id) {
            const user = yield Schema_1.User.findById(req.user.id);
            if (user) {
                // Check if the course is already purchased
                if (user.purchasedCourses.includes(course._id)) {
                    return res.status(400).json({ message: 'Course already purchased' });
                }
                // Add the course to the user's purchasedCourses and save
                user.purchasedCourses.push(course._id);
                yield user.save();
                res.json({ message: 'Course purchased successfully' });
            }
            else {
                res.status(403).json({ message: 'User not found' });
            }
        }
        else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
    else {
        res.status(404).json({ message: 'Course not found' });
    }
}));
router.get('/purchasedCourses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user && req.user.id) {
        // Find the user by ID and populate the 'purchasedCourses' field
        const user = yield Schema_1.User.findById(req.user.id).populate('purchasedCourses');
        if (user) {
            res.json({ purchasedCourses: user.purchasedCourses || [] });
        }
        else {
            res.status(403).json({ message: 'User not found' });
        }
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}));
router.get('/purchasedCoursesFilter', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { title } = req.query;
    try {
        const filterOptions = title ? { title: { $regex: new RegExp(title, 'i') } } : {};
        const user = yield Schema_1.User.findById(req.user.id).populate({
            path: 'purchasedCourses',
            match: filterOptions,
        });
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        res.json({ purchasedCourses: user.purchasedCourses });
    }
    catch (error) {
        console.error("Error fetching purchased courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Assuming Course and JWTPayload are correctly imported
// And authenticateJwt middleware is available and imported
router.get('/courses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user && req.user.id) {
            const user = yield Schema_1.User.findById(req.user.id);
            if (user) {
                const filterOptions = {};
                if (req.query.category) {
                    filterOptions.category = req.query.category; // Filters courses by category
                }
                if (req.query.level) {
                    filterOptions.level = req.query.level; // Filters courses by level
                }
                if (req.query.type) {
                    filterOptions.level = req.query.type;
                }
                // Fetch courses based on the constructed filter options
                const courses = yield Schema_1.Course.find(filterOptions);
                res.json({ courses });
            }
            else {
                res.status(404).json({ message: "User not found" });
            }
        }
        else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
    catch (error) {
        console.error("Error fetching purchased courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
