// Implementing authentication for login,
//using 'Local Strategy' of Passport.js
const LocalStrategy=require('passport-local').Strategy;

//bcrypt module use to encrypt the password , for security purpose of accounts
const bcrypt=require('bcryptjs');

// Bring Developer Model
const Student=require('../models/Student');

//Bring Company Model
const Admin = require('../models/Admin');


//Since,two authentication,
// (i)Student login
// (ii)Admin login
function SessionConstructor(userID,userGroup,details)
{
    this.userID=userID;
    this.userGroup=userGroup;
    this.details=details;
}


module.exports=function(passport){

    //--------------serialize and deserialize---------------

    // Serializing the user login
    passport.serializeUser((userObject,done)=>{

        //userObject could be of any model,let it be any
        let userGroup='student-model';
        let userPrototype=Object.getPrototypeOf(userObject);

        if(userPrototype===Student.prototype)
        {
            userGroup='student-model';
        }
        else if(userPrototype===Admin.prototype)
        {
            userGroup='admin-model';
        }

        let sessionConstructor=new SessionConstructor(userObject._id,userGroup,'');
        done(null,sessionConstructor); 
    })


    //deserializing the user login

    passport.deserializeUser((sessionConstructor,done)=>{
        if(sessionConstructor.userGroup=='student-model')
        {
            Student.findOne({
                _id:sessionConstructor.userID
            },(err,user)=>{
                done(err,user);
            })
        }
        else if(sessionConstructor.userGroup=='admin-model')
        {
            Admin.findOne({
                _id:sessionConstructor.userID
            },(err,user)=>{
                done(err,user);
            })
        }
    })



    //------------------Login authentication for student login-----------------------
    passport.use('local.student',
        new LocalStrategy({usernameField:'registrationNumber'},(registrationNumber,password,done)=>{
            //match account
            Student.findOne({registrationNumber:registrationNumber})
            .then(student=>{
                if(!student)
                {
                    return done(null,false,{message:'This email is not registered yet'});  
                }

                //it code comes here,it means email is registered
                //now check for password
                // bcrypt.compare(password,student.password,(err,isMatch)=>{
                //     if(err) throw err;
                //     if(isMatch)
                //     {
                //         return done(null,student);
                //     }
                //     else
                //     {
                //         return done(null,false,{message:'Incorrect Password, Try again'})
                //     }
                // })

                if(password==student.password){
                    return done(null,student);
                }
                return done(null,false);
            })
        })
    );


    //------------------------Login authentication for Admin login--------------------------

    passport.use('local.admin',
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            //match account
            Admin.findOne({email:email})
            .then(admin=>{

                //check if there is admin with given email or not
                if(!admin)
                {
                    //return with a flash messaging
                     return done(null,false,{message:'This email is not registered yet'});  
                }

                //it code comes here,it means email is registered
                //now check for password
                // bcrypt.compare(password,admin.password,(err,isMatch)=>{
                //     if(err) throw err;
                    
                //     //check does password matches or not
                //     if(isMatch)
                //     {
                //         return done(null,admin);
                //     }
                //     else
                //     {
                //         return done(null,false,{message:'Incorrect Password, Try again'})
                //     }
                // })

                if(password==admin.password){
                    return done(null,admin);
                }
                return done(null,false);
            })
        })
    );

   

}