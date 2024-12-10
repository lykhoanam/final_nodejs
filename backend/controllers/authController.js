const { OAuth2Client } = require('google-auth-library');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs'); 
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const client = new OAuth2Client("1074315812564-92s9klc0eos45ujtefj613bkualvulq0.apps.googleusercontent.com");





const registerUser = async (req, res) => {
  const { fullName, phone, email, address, province, district, ward, username, password } = req.body;

  try {
    // Check if the user already exists by email or username
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "Email hoặc tên đăng nhập đã tồn tại." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      fullName,
      phone,
      email,
      address,
      province,
      district,
      ward,
      username,
      password: hashedPassword,
      imageUrl: "", // Initialize imageUrl as an empty string
    });

    // Save user to database
    await newUser.save();

    // Send response
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
  }
};


const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Tên đăng nhập không tồn tại." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác." });
    }

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });

    res.json({ token, user, message: "Đăng nhập thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
  }
};

const googleLogin = async (req, res) => {
  const { token, profile } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "1074315812564-92s9klc0eos45ujtefj613bkualvulq0.apps.googleusercontent.com", 
    });

    const payload = ticket.getPayload();
    const email = profile.email;
    const fullName = profile.name || "";  
    const googleId = profile.googleId;
    const imageUrl = profile.imageUrl || ""; 

    const phone = "";
    const address = ""; 
    const province = ""; 
    const district = ""; 
    const ward = ""; 
    const username = googleId; 

    // Check if the user already exists
    let user = await User.findOne({ email });
  

    if (!user){
      user = new User({
        fullName,
        phone: phone || "", 
        email,
        address: address || "", 
        province: province || "",
        district: district || "", 
        ward: ward || "", 
        username,
        password: "", 
        imageUrl,
      });

      await user.save();
    } else {
      // Update imageUrl if user exists
      user.fullName = user.fullName;
      user.email    = user.email;
      user.imageUrl = user.imageUrl;
      user.username = user.username;
      user.password = user.password;
      await user.save();
    }

    // Create JWT token for the user
    const jwtToken = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });

    res.json({
      success: true,
      token: jwtToken,
      user,
      imageUrl, 
      message: "Đăng nhập với Google thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
  }
};

const sendOTP = async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: "lykhoanamvn@gmail.com", 
      pass: "bujf flmy rhpa pfzs",  
    },
  });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // OTP hết hạn sau 5 phút
    await user.save();


    await transporter.sendMail({
        from: 'lykhoanamvn@gmail.com',
        to: `${email}`,
        subject: "Mã Xác Minh OTP",
        text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
        html: `<p>Mã OTP của bạn là: <strong>${otp}</strong>. Mã này có hiệu lực trong <strong>5 phút</strong>.</p>`,
    },
    (err)=> {
        if(err){
          return res.json({
            message:"Lỗi",
            err,
          })
        }

        return res.json({
          message: "Đã gửi mail thành công cho tài khoản ${email}"
        })
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi gửi OTP." });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body; 

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    if (user.otp !== otp) {  
      return res.status(400).json({ message: "Mã OTP không chính xác." });
    }

    if (Date.now() > user.otpExpiresAt) {
      return res.status(400).json({ message: "Mã OTP đã hết hạn." });
    }

    user.otp = null;  
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "Xác minh OTP thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi xác minh OTP." });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi thay đổi mật khẩu." });
  }
};


// Controller to handle the image upload route
const uploadImage = async (req, res) => {
  const { 
    email, 
    fullName, 
    phone, 
    location, 
    province, 
    district, 
    ward, 
    password, 
    image 
  } = req.body;

  try {
    // Tìm người dùng bằng email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Cập nhật thông tin người dùng
    if (image) user.imageUrl = image;
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (province) user.province = province;
    if (district) user.district = district;
    if (ward) user.ward = ward;

    // Hash mật khẩu mới nếu có thay đổi
    if (password) {
      const saltRounds = 10; // Độ mạnh của salt
      user.password = await bcrypt.hash(password, saltRounds);
    }

    // Lưu thông tin người dùng vào cơ sở dữ liệu
    await user.save();

    res.status(200).json({
      success: true,
      message: "User information updated successfully!",
      user: {
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        location: user.location,
        province: user.province,
        district: user.district,
        ward: user.ward,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user information.",
      error: error.message,
    });
  }
};


// admin

const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách người dùng.', error: error.message });
  }
};

const fetchUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tìm kiếm người dùng.', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const {_id} = req.body; 

    if (!_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const deletedUser = await User.findByIdAndDelete(_id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { _id, fullName, phone, email, address } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { fullName, phone, email, address },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  registerUser,
  loginUser,  
  googleLogin,
  sendOTP,
  verifyOTP,
  resetPassword,
  uploadImage,
  fetchAllUsers,
  deleteUser,
  updateUser,
};
