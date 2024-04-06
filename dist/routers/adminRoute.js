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
        const { email, name, password } = req.body;
        const admin = yield Schema_1.Admin.findOne({ email });
        if (admin) {
            res.status(403).json({ message: "Admin Already exsists" });
        }
        else {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newAdmin = new Schema_1.Admin({ name, email, password: hashedPassword });
            yield newAdmin.save();
            res.status(200).json({ message: "Admin created successfully" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield Schema_1.Admin.findOne({ email });
        if (!admin) {
            return res.status(403).json({ message: "Invalid email or password" });
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, admin.password);
        if (isPasswordCorrect) {
            const token = jsonwebtoken_1.default.sign({ id: admin._id, email: admin.email }, SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "User logged in successfully", token });
        }
        else {
            res.status(403).json({ message: "Invalid username and password" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post('/courses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, imageLink, price, category, level, type } = req.body;
        const course = yield Schema_1.Course.findOne({ title });
        if (course) {
            res.status(403).json({ message: "Course already exsists" });
        }
        else {
            const newCourse = new Schema_1.Course({ title, description, price, imageLink, category, level, type });
            yield newCourse.save();
            res.status(200).json({ message: "Course created successfully", courseId: newCourse._id });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get('/courses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Schema_1.Course.find();
    res.status(200).json({ message: "all the courses", courses });
}));
router.put('/courses/:courseId', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const updates = req.body;
    try {
        const updatedCourse = yield Schema_1.Course.findByIdAndUpdate(courseId, updates, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.delete('/courses/:courseId', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    try {
        const deletedCourse = yield Schema_1.Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
