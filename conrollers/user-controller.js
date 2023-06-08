const User = require("../models/user-models");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')
const Product = require('../models/product-model')
const category = require('../models/catogory-model')
const Address = require('../models/address-model')
const Order = require('../models/order-modal')
// const dotenv = require('dotenv')
// dotenv.config()

let otp;

//change password into hash password

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

//for loading register page

const loadRegister = async (req, res) => {
  try {
    res.render("registar-page");
  } catch (error) {
    console.log(error.message);
  }
};

//for loading login page

const 
loginload = async (req, res) => {
  try {
    res.render("login-page");
  } catch (error) {
    console.log(error.message);
  }
};

//for loading verification page page

const verificationLoad = async (req, res) => {
  try {
    res.render("verification");
  } catch (error) {
    console.log(error.message);
  }
};

// loading shop page

const loadShop = async (req, res) => {
  try {
    const categoryData = await category.find({is_delete:false})
    const session = req.session.user_id;
    const productData = await Product.find({is_delete:false})

    if (!session) {
      
      return res.render("shop-page",{session:session,product:productData,category:categoryData});
    }

    const userData = await User.findById({_id:req.session.user_id});
    if (userData) {
      return res.render("shop-page", { user: userData,session,product:productData,category:categoryData });
    } else {
    
      const session = null
      return res.render("shop-page",{session,product:productData,category:categoryData});
    }
  } catch (error) {
    console.log(error.message);
  }
};

//for loading single product details

const loadSingleProduct = async(req,res)=>{
  try {
    const session = req.session.user_id;
    const id = req.query.id;
    const productdata = await Product.findById({_id:id});
    res.render('single-product-details',{product:productdata,session})
  } catch (error) {
    console.log(error.message);
  }  
}

//for loading userpage

const loaduserprofile = async(req,res)=>{
  try {
    
    const session = req.session.user_id;
    const userData = await User.findById({_id:req.session.user_id,session})
    res.render('user-profile',{user:userData,session:session})

  } catch (error) {
    console.log(error.message);
  }
}

// loadin user profile

const editProfile = async(req,res)=>{
  try {
    const id =req.params.id
    const userData = await User.find({_id:id})
    if(userData){
      res.render('user-profile',{user:userData})
    }else{
      res.redirect('/user-profile')
    }

  } catch (error) {
    console.log(error.message);
  }
}





//update user profile

const updateUser = async (req, res) => {
  try {
    const name = req.body.name;
    const mobile = req.body.mobile;
    const userData = await User.findByIdAndUpdate(
      req.session.user_id,
      { name: name, mobile: mobile },
      { new: true }
    );
    await userData.save();

    if (userData) {
      res.redirect('/user-profile');
    } else {
      res.redirect('/user-profile');
    }
  } catch (error) {
    console.log(error.message);
  }
};


//insert new user

let email
const insertUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);

      const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mno,
      password: spassword,
      is_admin: 0,
    });
    email=user.email
    const name = req.body.name

   const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.render("registar-page", {
        message: "Email already registered",
      });
    }
    else{
      const userData = await user.save();
      if(userData){
        randomnumber = Math.floor(Math.random() * 9000) + 1000
        otp=randomnumber
        console.log(otp,'===',req.body.email);
        sendVerifyMail(name,req.body.email,randomnumber)
        res.redirect("/verification")
      }else{
        res.render("registar-page", { message: "Your Registration has been failed " });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

//verif email and password of user

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_verified === true) {
          if (userData.is_block === true) {
            res.render("login-page", { message: "You are blocked" });
          } else {
            req.session.user_id = userData._id;
            res.redirect("/home-page");
          }
        } else {
          res.render("login-page", {
            message: "Email or password is incorrect",
          });
        }
      } else {
        res.render("login-page", { message: "Email or password is incorrect" });
      }
    } else {
      res.render("login-page", {
        message: "User not found. Please provide a valid email and password",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.render("login-page", { message: "An error occurred" });
  }
};



// sending mail to user

const sendVerifyMail = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.VERIFYEMAIL,
        pass: process.env.PASSWORDID
      }
    });

    const mailOptions = {
      from: 'muneestk5017@gmail.com',
      to: email,
      subject: 'Verification Email',
      html: `<p>Hi ${name}, please click <a href="http://localhost:3000/otp">here</a> to verify and enter your verification email. This is your OTP: ${otp}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email has been sent:', info.response);
    console.log(otp);
  } catch (error) {
    console.log(error);
  }
};




//  Verifying the users otp and redirecting to login page

const verifyEmail = async (req,res)=>{
  const otp2= req.body.otp;
  try { 
      if(otp2==otp){
          const UserData = await User.findOneAndUpdate({email:email},{$set:{is_verified:true}});
          if(UserData){
            req.session.user_id = UserData._id;
            res.redirect("/home-page");
          }
          else{
              console.log('something went wrong');
          }
      }
      else{
          res.render('verification',{message:"Please Check the OTP again!"})
      }
  } catch (error) {
      console.log(error.message);
  }
}


//for loading home

const loadHome = async (req, res) => {
  try {
    const session = req.session.user_id;
    const productData = await Product.find({is_delete:false})
    
    
    if (!session) {
      return res.render("home-page",{session:session,product:productData});
    }

    const userData = await User.findById({_id:req.session.user_id});
    if (userData) {
      return res.render("home-page", { user: userData,session,product:productData});
    } else {
      const session = null
      return res.render("home-page",{session,product:productData});
    }
  } catch (error) {
    console.log(error.message);
  }
};




//for user logout

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadRegister,
  loginload,
  insertUser,
  verifyLogin,
  loadHome,
  userLogout,
  verifyEmail,
  loadShop,
  sendVerifyMail,
  verificationLoad,
  loadSingleProduct,
  loaduserprofile,
  editProfile,
  updateUser,
  

};

