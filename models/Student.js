// This is a company's account schema,it have

//     (i) Company Name
//     (ii)Its email
//     (iii)Company size (as info for developers)
//     (iv)Country,where its based 
//     (v)password(encrypted using bcryptjs module with 10 charactes long encryption) 

//ORM used is this project is mongoose,for simplicity
//and each of interaction with Mongodb database
const mongoose = require('mongoose');

const StudentSchema=mongoose.Schema({
    registrationNumber:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    hashes:[{
        name:{type:String},
        description:{type:String},
        url:{type:String}
    }],
    texthashes:[{
        title:{type:String},
        text:{type:String},
        url:{type:String}
    }],
    notifications:[String]

});

//Naming the created schema 'CompanySchema'
const Student=mongoose.model('Student',StudentSchema);
//then export it to use 
module.exports=Student;