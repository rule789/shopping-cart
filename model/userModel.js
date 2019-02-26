const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  password:{
    type: String,
    require: true
  },
});


// methods test
// UserSchema.methods.speak = function(){
//   console.log('My name is'+ this.name);
// }


UserSchema.methods.createUser = function() {
  return this.save();
}


// export User Schema
var User = mongoose.model('User', UserSchema);

module.exports = {User};
