const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middlwares/authMiddleware');


// new user registartion
router.post('/register', async (req, res) => {
    try {
        //check if user alredy exists
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            throw new Error("Staff Member Already Logged in System");
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        // save user
        const newUser = new User(req.body);
        await newUser.save();
        res.send(
            {
                success: true,
                message: "Staff Member Register  Successfully",
            }
        );


    } catch (error) {
        res.send(
            {
                success: false,
                message: error.message
            }
        )
    }
});

// user login 
router.post("/login", async (req, res) => {
    try {
        //check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new Error("Invalid Credentials Or Please Check Your Login Details Correctly");
        }
        // if user is active
        if (user.status !== "active"){
            throw new Error ("The Staff Member  Account Is Blocked , Please Contact Admin");
        }
        //compare password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            throw new Error("Authentication failed: Incorrect password");
        }
        // create and assign token
        const token = jwt.sign({ userId: user._id }, process.env.jwt_secret);

        //send response
        res.send({
            success: true,
            message: "User logged in successfully",
            data: token
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


// get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

// get  all users
router.get("/get-users", authMiddleware , async (req, res) => {
    try {
        const users = await User.find();
        res.send({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//update user
router.put("/update-user-status/:id", authMiddleware, async (req,res) => {
    try {
        await User.findByIdAndUpdate (req.params.id, req.body);
        res.send({
            success: true,
            message: "Staff Member  status updated successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});
module.exports = router;