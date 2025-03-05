require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendOTP(email) {
    try {
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Configure the mail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",  
            auth: {
                user: 'ankitpandey1259@gmail.com',
                pass: 'mkdhlozcmebucijk', // Use App Password for Gmail
            },
        });

        // Email details
        const mailOptions = {
            from: 'ankitpandey1259@gmail.com',
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("OTP sent:", info.response);
        

        return otp; // Return the OTP to validate later
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
}
    // sendOTP(companyemail).then((otp) => {
            //     console.log("Generated OTP:", otp);
            // });

module.exports={
    sendOTP
}

