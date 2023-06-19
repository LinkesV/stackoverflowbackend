import mongoose from "mongoose";


const questionSchema = new mongoose.Schema({
    ques:{
        type:String,
        required:true,
    },
    para:{
        type:String,
        required:true,
    },
    by:{
        type:String,
        required:true,
    },
    views:{
        type:Number,
    },
    votes:{
        type:Number,

    },
    tag:{
        type:Array,
    },
    answers:{
        type:Array,
    },
    

})

const Question = mongoose.model("Question",questionSchema);
export default Question