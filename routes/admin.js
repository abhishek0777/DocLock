//Express framework for server side programming
const express = require("express");
const path = require("path");

const router = express.Router();

//module for encryption of password
const bcrypt = require("bcryptjs");
//module for login authentication
const passport = require("passport");

// bring in all models
const Student=require('../models/Student')
const Admin=require('../models/Admin')


//bring auth-config file
// =>ensureAuthenticated : Use to protect the routes
// =>forwardAuthenticated : by pass the routes without having authentication
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get("/login", (req, res) => {
  res.render("admin/login");
});

router.get("/dashboard", (req, res) => {
    res.render("admin/dashboard",{
        user:req.user
    });
});

router.post("/upload",(req,res)=>{
    //need to have a flash message that file has been uploaded
    // res.render('admin/dashboard');
    console.log(req.body);
    const {registrationNumber,fileName,fileDescription,hash}=req.body;
    var hashed={
        name:fileName,
        description:fileDescription,
        url:hash
    }
    console.log(hashed);
    Student.findOne({registrationNumber:registrationNumber},(err,student)=>{
        student.hashes.unshift(hashed);
        Student.updateOne({registrationNumber:registrationNumber},student,(err)=>{
            if(err){
                console.log(err);
                return;
            }
            res.render('admin/dashboard');
        })
    })


    res.render('admin/dashboard',{
        user:req.user
    })
})

router.get("/upload/",(req,res)=>{

    
    console.log("hello");
    return
})

//handle post request for Student login page

//here comes,passport.js 's 'Local strategy'
// for Student, we have create 'local.student' named to strategy
//will authenticatec company and most imp , serialize it as a user
router.post("/login", (req, res, next) => {
  passport.authenticate("local.admin", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login",
    failureFlash: true,
  })(req, res, next);
});

//This route logout the admin
//deserialize it
//and redirect to admin's login page again
//with a success flash message
router.get("/logout", ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/admin/login");
});

module.exports = router;
