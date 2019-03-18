var express = require('express');
var router = express.Router();


var {mongoose} = require('../model/connect.js');
var {Cart} = require('../model/cartModel.js');
var {Order} = require('../model/orderModel.js')
const {Product} = require('../model/productModel.js');
var ensureAuth = require('../config/isLogIn.js');

// All product page
router.get('/', function(req, res, next) {
  // console.log(req.session);
  Product.find().then((items) => {
    // console.log(items);
    res.render('index', {
      title: 'Shop',
      products: items,
    });
  })
});


// item page
router.get('/product/:item', (req, res, next) => {
  // console.log(req.session);
  Product.findById(req.params.item).then((product) => {
    // cart是否有相同商品
    let cart = req.session.cart || [];
    let sameItemIndex = cart.findIndex(function(item){
      return item._itemId == req.params.item;
    });

    let intro = product.introduction;
    let des = product.description;
    let spe = product.specification;
    // console.log(des, spe);

    res.render('item', {
      title: 'Shop',
      sameItemIndex,
      item: product,
      intro: intro,
      des: des,
      spe: spe,
    });
  });

});



// 加入購物車
router.post('/cart/add', (req, res, next) => {
  console.log(req.body);
  // console.log(req.session.cart);

  // 購物車沒有商品
  if(!req.session.cart){
    req.session.cart = [{
      _itemId: req.body._itemId,
      quantity: 1,
    }];
  } else {
  // 購物車已有商品
    let cart = req.session.cart;
    let newItem = req.body;
    newItem.quantity = 1;
    // console.log(newItem);
    cart.push(newItem);
    req.session.cart = cart;
  }

  // 有登入加進cart
  if(req.user){
    // console.log(req.user);
    let item = new Cart({
      _creator: req.user._id,
      _itemId: req.body._itemId,
    });

    item.save().then(()=> {
      res.send('item added');
    });
  } else {
    res.send('item added');
  }
});




// cart page
router.get('/cart', (req, res, next) => {
  // console.log(req.session);
  let sessionItem = req.session.cart || [];

  let render = sessionItem.map((session) => {
    return Product.findById(session._itemId).then((item) => {
      let itemArray = {
        item: item,
        quantity: session.quantity,
      };
      return itemArray;

    });
  });

  Promise.all(render).then((item) => {
    // console.log(item);
    res.render('cart', {
      title: 'Cart',
      cartItem: item,
    });
  });
});


// 更改數量
router.patch('/cart/quantity', (req, res, next) => {

  for(let i=0; i<req.session.cart.length; i++){
    if( req.session.cart[i]._itemId == req.body._itemId){
      req.session.cart[i].quantity = parseInt(req.body.quantity);
    }
  }

  if(req.user){
    Cart.findOneAndUpdate({
      _creator: req.user._id,
      _itemId: req.body._itemId
    },
    {$set: {
      quantity: req.body.quantity
    }},
    {new: true}).then((item) => {
      // console.log(item);
    })
  }

  res.send('success');
})


// 刪除購物車商品
router.delete('/cart/remove', (req, res, next) => {
  // 刪除session中物品
  let index = req.session.cart.findIndex((item) => {
    return item._itemId == req.body._itemId;
  });
  req.session.cart.splice(index, 1);

  // 若有登入
  if(req.user){
    Cart.findOneAndRemove({_creator: req.user._id, _itemId: req.body._itemId}).then((item) => {
      // console.log(item);
    })
  }

  res.send();
});


// 結帳
router.get('/order/create', (req, res, next) => {
  // console.log(req.body);
  if(req.user){
    res.redirect('/order');
  } else {
    res.redirect('/users/login?p=1&destination=/order');
  }
});


// 訂單頁面
router.get('/order', ensureAuth, (req, res, next) => {
  // console.log(req.session.cart);
  let session = req.session.cart;
  let render = session.map((eachSession) => {
    return Product.findById(eachSession._itemId).then((eachProduct) => {
      // console.log(eachSession);
      return {item: eachProduct, qun: eachSession.quantity};
    });
  });

  Promise.all(render).then((render) => {
    // console.log(render);
    res.render('order', {
      title: 'Cart',
      item: render,
    });
  }).catch((e) => {
    console.log(e);
  });

});


// 送出訂單
router.post('/order', ensureAuth, (req, res, next) => {
  let time = new Date().getTime();

  Order.find().sort("-orderNumber").limit(1).then((lastItem) => {
    let orderNumber;
    if( lastItem.length == 0){
      orderNumber = 1;
    } else {
      orderNumber = lastItem[0].orderNumber + 1;
    }
    return orderNumber;

  }).then((orderNumber) => {
    Cart.find({_creator: req.user._id}).then((cart) => {
      cart.forEach((carteach) => {
        let orderItem = new Order({
          _creator: req.user._id,
          _itemId: carteach._itemId,
          quantity: carteach.quantity,
          orderNumber: orderNumber,
          time: time,
          address: req.body.address,
          person: req.body.person,
          phone: req.body.phone,
          paymentway: req.body.paymentway,
        });

        orderItem.save();
      })
    })
  }).then(() => {
    return Cart.deleteMany({_creator: req.user._id});
  }).then(() => {
      res.redirect('/order/finish');
  })
});



// 完成訂單頁面
router.get('/order/finish',ensureAuth, (req, res, next) => {
  res.render('orderFinish', {
    title: 'Cart',
  })
});

module.exports = router;
