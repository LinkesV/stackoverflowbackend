import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import cors from 'cors'
import bcrypt from 'bcrypt'
import User from './models/user.js';
import Question from './models/questions.js';

const saltrounds = 10;
const app = express();
dotenv.config();



app.use(cors({
    origin:true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


mongoose.connect("mongodb://0.0.0.0:27017/StackOverFlow" , {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Connected to the database')
})
.catch((err)=>{
    console.log(err)
})

//-------------------------------------------------------------------------------------------------------------------------------------------------\\

    // POST REQUEST - signUp

    app.post('/usersignup',(req,res)=>{
        bcrypt.hash(req.body.password, saltrounds, function(err,hash){
            const stackoverflowuser = new User({
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                password:hash,
                aboutme:req.body.aboutme,
                questions:req.body.questions,
                votes:req.body.votes
            })
            stackoverflowuser.save()
            .then(()=>{
            res.send({message:'User added succesfully'})
            })
            .catch((err)=>{
            console.log(err)
            })
        })
        
    })                                                                                                                                           

    // POST REQUEST - Login

    app.post('/login', (req,res)=>{
        User.findOne({email:req.body.email})
       .then((user)=>{
           if(!user){
               res.json({message:'Username not found',login:false})
           }
           else{
               bcrypt.compare(req.body.password,user.password,function (err,result){
                   if(result == true){
                    res.redirect('/')
                   }
                   else{
                    res.json({message:'Password not found',login:false})

                   }
               })
               
           }
       })
   })

   //PUT REQUEST --> FORGOT PASSWORD
   app.put('/reset', (req,res)=>{
    bcrypt.hash(req.body.newpassword, saltrounds, function(err,hash){
        User.findOneAndUpdate({email:req.body.email},{
            password:hash
        })
       .then((updateduserinfo)=>{

           if(updateduserinfo == undefined){
               res.json({message:'Email not found.Please try again',reset:false})
           }
           else{
               res.json({message:'Password reset successfully. You may log in now',reset:true})
           }
       })
       .catch((err)=>{
        console.log(err)
       })
    })
})
   

   //BASIC GET REQUEST --> no password
 app.get('/',(req,res)=>{
        User.findOne(req.body.email)
        .then((user)=>{
            res.send({
                fname:user.firstname,
                lname:user.lastname,
                email:user.email,
                aboutme:user.aboutme,
                questions:user.questions,
                votes:user.votes

            });
        })
        .catch((err)=>{
            console.log(err)
        })
    })
   

// Post a question 

app.post('/addquestion',(req,res)=>{
        const newquestion = new Question({
            ques: req.body.ques,
            para:req.body.para,
            by:req.body.by,
            tag:req.body.tag,
            votes:0,
            views:0,
        })
        newquestion.save()
        .then(()=>{
        res.send({message:"Question added successfully"})
        })
        .catch((err)=>{
        console.log(err)
        })
        
})        

app.put('/addquestiontouser',(req,res)=>{
    console.log(req.body.arrayofques)
    User.findOneAndUpdate({email:req.body.email},{
        questions:req.body.arrayofques
    })
    .then(()=>{
        res.send({message:"updated succesfully"})
        })
    .catch((err)=>{
        console.log(err)
        })
})

// GET ALL QUESTIONS
app.get('/getallquestions',(req,res)=>{
    Question.find()
    .then((questions)=>{
        res.send(questions);
    })
    .catch((err)=>{
        console.log(err)
    })
})

// GET ONE QUESTION
app.get('/getquestions/:id',(req,res)=>{
    
    Question.findById(req.params.id) 
    .then((question)=>{
        res.send(question);
    })
    .catch((err)=>{
        console.log(err)
    })
})

// ADD COMMENT TO THE QUESTION
app.put('/addcomment',(req,res)=>{
    Question.findByIdAndUpdate({_id:req.body.id},{
        answers:req.body.answers
    })
    .then(()=>{
        res.send({message:"Comment added succesfully"})
        })
    .catch((err)=>{
        console.log(err)
        })
})

//-------------------------------------------------------------------------------------------------------------------------------------------------\\

app.listen( 4000,()=>{
    console.log('Server Connected successfully ')
})