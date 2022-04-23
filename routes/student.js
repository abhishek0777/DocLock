//Express framework for server side programming
const express=require("express");
const path=require('path');

const router=express.Router();

//module for encryption of password
const bcrypt=require('bcryptjs');
//module for login authentication
const passport=require('passport');

//bring auth-config file
// =>ensureAuthenticated : Use to protect the routes 
// =>forwardAuthenticated : by pass the routes without having authentication
const {forwardAuthenticated,ensureAuthenticated}=require('../config/auth');

//handle post request for Student login page

//here comes,passport.js 's 'Local strategy'
// for Student, we have create 'local.student' named to strategy
//will authenticatec company and most imp , serialize it as a user
router.post('/login',(req,res,next)=>{
    passport.authenticate('local.student',{
        successRedirect:'/student/dashboard',
        failureRedirect:'/student/login',
        failureFlash:true
    })(req,res,next)
})


//This route logout the student
//deserialize it
//and redirect to student's login page again
//with a success flash message
router.get('/logout',ensureAuthenticated,(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/company/login');
})
