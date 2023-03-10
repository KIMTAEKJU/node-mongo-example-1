const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function (next) {
    
    /**
     * 비밀번호 암호화
     */
    bcrypt.genSalt(saltRounds, (err, salt) => {

        const user = this;
        console.log('user: ', user);
        if (user.isModified('password')) {

            if (err) return next(err);
    
            bcrypt.hash(user.password, salt, function (err, hash) {
                // Store hash in your password DB.
    
                if (err) return next(err);
                user.password = hash;
                next();
            });
        } else {
            next();
        }
    });
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {

        if (err) return cb(err);
        cb(null, isMatch);
    })
};

userSchema.methods.generateToken = function (cb) {
    // jsonwebtoken을 이용하여 생성

    const user = this;
    const token = jwt.sign(user._id.toJSON(), 'secretToken');

    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
};

const User = mongoose.model('User', userSchema);

module.exports = ({ User });
