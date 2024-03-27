const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../dataModels/User.model'); 
const nodemailer = require('nodemailer'); 
const bcrypt = require("bcrypt");
router.get('/forgot-password', (req, res) => {
    const filePath = path.join(__dirname, "..", "views", "forgotPassword.html");
    res.sendFile(filePath);
});


router.post('/send-reset-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = generateOTP();

        // Save OTP to user document in the database (you might have a resetOTP field in your User schema)
        user.resetPasswordOTP = otp;
        await user.save();
        console.log('User after OTP generation:', user);


        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
          
            service: 'gmail',
            auth: {
                user: 'eventmanagement188@gmail.com',
                pass: 'wshm iwqj bxdn qzuw'
            }
        });

        const mailOptions = {
            from: 'eventmanagement188@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };

       
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to send OTP email' });
            }
            res.redirect('/reset-password');
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Implement OTP generation logic as required
function generateOTP() {
    // Logic to generate OTP, e.g., using a library or custom logic
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}
// Assuming you have required necessary modules and initialized your Express app
router.get('/reset-password', (req, res) => {
    const filePath = path.join(__dirname, "..", "views", "resetPassword.html");
    res.sendFile(filePath);
});
router.post('/reset-password', async (req, res) => {
    const { otp, newPassword, confirmPassword } = req.body;

    try {
        // Fetch the user by the resetOTP field and ensure the OTP matches
        const user = await User.findOne({ resetPasswordOTP: otp });

        if (!user) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Check if newPassword and confirmPassword match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Update the user's password and clear the resetOTP
        const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
        user.resetPasswordOTP = null; // Clear the resetOTP field
        await user.save();

        res.json({ message: 'Password reset successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
