import mongoose from 'mongoose';
import { createHmac ,randomBytes} from 'node:crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true //sparse allows documents to have a null value for this field without violating the unique constraint, and allows multiple users to have no googleId having null value while still enforcing uniqueness when one exists.
    },
    salt:{
        type: String,
        select: false
    },
    password: {
        type: String,
        required: function(){
            return this.authProvider === 'local';
        },
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    sessionVersion: {
        type: Number,
        default: 0
    },
    profileImage: {
        type: String,
        default: null
    },
    profileImageFileId: {
        type: String,
        default: null
    },
},{timestamps: true});

userSchema.pre('save', async function(){
    const user= this;
    if(!user.isModified('password')) return;
    const salt= randomBytes(16).toString('hex');
    const hashedPassword= createHmac('sha256', salt) //hashedPassword-->irreversible 64-character hexadecimal string
        .update(user.password)
        .digest('hex');

    user.salt= salt;
    user.password= hashedPassword;
})

// mongoose virtual function to hide the salt and password fields when converting the user document to JSON
userSchema.virtual('profile').get(function() {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        profileImage: this.profileImage,
    };
});

userSchema.static('matchPassword', async function(email, password){
    const user= await this.findOne({email: email}).select('+salt +password');// 'this' refers to the User model
    if(!user) return null;

    const salt= user.salt;
    const hashedPassword= user.password;

    const UserProvidedHash= createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if(UserProvidedHash !== hashedPassword) return null;
    return user;
})

const User= mongoose.model('User', userSchema);
export default User;