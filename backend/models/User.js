import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    avatar:{
        type:String,
        default: ""
    },
    bio:{
        type:String,
        default: "",
        maxlength: 200
    },
    bookmarks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll"
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isVerified:{
        type:Boolean,
        default:false
    },
    otp: { type: String },
    otpExpires: { type: Date }
}, {
    timestamps:true
})

// to hash the password before saving it to the database
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// to compare the password entered by the user with the hashed password in the database
userSchema.methods.matchPassword =  function(plain){
    return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
