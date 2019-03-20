const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: [true, '已有此帳號']
  },
  password:{
    type: String,
    require: true
  },
});




UserSchema.methods.createUser = function() {
  return this.save();
}

UserSchema.statics.getUserByEmail = function(email){
  let User = this;
  return User.findOne({email});
}

UserSchema.methods.comparePassword = function(password, dbpassword, callback){
  bcrypt.compare(password, dbpassword, function(err, res){
    callback(err, res);   // res= true or false
  });
}

UserSchema.statics.getUserById = function(id, callback){
  // console.log(id);   // 即顯示user._id
  let User = this;
  User.findById(id, callback);
}

UserSchema.pre('save', function(next){
  let user = this;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash( user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

// export User Schema
var User = mongoose.model('User', UserSchema);

module.exports = {User};
