var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var _ = require('lodash');
var moment = require('moment');

var {body, check, validationResult} = require('express-validator/check');
var {mongoose} = require('../model/connect.js');
var {User} = require('../model/userModel.js');
var {Cart} = require('../model/cartModel.js');
var {Order} = require('../model/orderModel.js');
var {Product} = require('../model/productModel.js');
var ensureAuth = require('../config/isLogIn.js');


// user profile page
router.get('/profile', ensureAuth, function(req, res, next) {
  Order.find({_creator: req.user._id}).lean().then((orderRecords) => {
    let orderItemInfro = orderRecords.map((item) => {
      return Product.findById(item._itemId).then((product) => {
        item.price = product.price;
        item.itemName = product.itemName;
        return item;
      });
    });
    return Promise.all(orderItemInfro);

  }).then((orderItemInfro) => {
    return orderIntegraInfro(orderItemInfro);
  }).then((orderTotalInfro) => {
    res.render('userProfile', {
      title: 'Members',
      orderIntegrate: orderTotalInfro.orderIntegrate,
      orderItemInfro: orderTotalInfro.orderItemInfro,
    });
  });
});



// 只有每筆訂單、時間、總金額的資訊
function orderIntegraInfro(orderItemInfro){
  let orderIntegrate = [];
  orderItemInfro.forEach((eachItem) => {
    let time = moment(eachItem.time).format('YYYY-MM-DD');
    let index = orderIntegrate.findIndex((item) => {
      return eachItem.orderNumber == item.orderNumber});
    if(index == -1){
      orderIntegrate.push({
        orderNumber: eachItem.orderNumber,
        time: time,
        total: eachItem.quantity*eachItem.price,
      });
    } else {
      orderIntegrate[index].total = orderIntegrate[index].total + eachItem.quantity*eachItem.price;
    }
  });
  return {orderIntegrate, orderItemInfro};
}


// register page
router.get('/register', function(req, res, next){
  res.render('register', {
    title: 'Register',
  });
});


// register
router.post('/register', function(req, res, next){
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  newUser.createUser()
    .then((user) => {
      req.flash('success', '登入成功');
      res.redirect('/');
    })
    .catch((e) => {
      if(e.name == 'MongoError' &&  e.code == 11000){
        req.flash('error', '此Email已註冊');
        res.redirect('/users/register');
      }
    });
});


// login page
router.get('/login', function(req, res, next){
  res.render('login', {
    title: 'Login',
    url: req.url,
  });
});


// login
router.post('/login',
  // middleware 身分認證
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true}),

  function(req, res){
    // 載入購物車到session
    Cart.find({_creator: req.user._id}).then((item) => {
      if (req.session.cart){
        let session = req.session.cart;
        // 購物車資料庫更新
        mergeSessionCart(req.user._id, session, item);
        // session更新
        sessionUpdate(session, item).then((session) => {
          req.session.cart = session;
        });
      } else {
        req.session.cart = item;
      }
    }).then(() => {
    // 登入後跳轉
      if(req.query.destination){
        res.redirect(req.query.destination)
      } else {
        req.flash('success', '你已經登入');
        res.redirect('/');
      }
    }).catch((e) => {
      console.log(e);
    })
  });


// session內的存入Cart
function mergeSessionCart(user, session, item){
  session.forEach((sessionItem) => {
  // 判斷是否為new item
    let index = item.findIndex((cartItem) => {
      return sessionItem._itemId == cartItem._itemId.toString();
    });

    // session item is new item
    if(index == -1){
      let newItem = new Cart({
        _creator: user,
        _itemId: sessionItem._itemId,
        quantity: sessionItem.quantity,
      });
      newItem.save();
    } else {
    // session item has added, so update quantity
      Cart.findOneAndUpdate({
        _creator: user,
        _itemId: sessionItem._itemId,
      },{
        $set:{quantity: sessionItem.quantity}
      },
      {new: true}
      ).then((cart) => {
      });
    }
  });
}

// Cart裡的 放入 session.cart
function sessionUpdate(session, item){
  // Cart有 session沒有 的item抓出來
  cartOnly = item.filter(function(each){
    return session.findIndex((eachIndex) => {
      return eachIndex._itemId == each._itemId.toString();
    }) == -1;
  });
  session = session.concat(cartOnly).map((item) => {
    return {_itemId: item._itemId, quantity: item.quantity};
  });
  return Promise.resolve(session);
}


//  passport 登入驗證
passport.use(new LocalStrategy({
  usernameField: 'email',
  },
  function(username, password, done) {
    User.getUserByEmail(username)
      .then((user, err) => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: '帳號有誤' });
        }
        user.comparePassword(password, user.password, function(err, isMatch){
            if(err) {return done(err); }
            if(isMatch){
              return done(null, user);
            } else {
              return done(null, false, {message: '密碼有誤'});
          }
        });
    });
  }
));


// 加入session認證 尋找使用者 存id
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


// logout
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/users/login');
});


module.exports = router;
