const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  itemName: {
    required: true,
    type: String
  },
  price: {
    required: true,
    type: Number,
  },
  introduction: {
    required: true,
    type: [String],
  },
  description: {
    required: true,
    type: [String],
  },
  specification: {
    required: true,
    type: [String],
  },
  img : {
    required: true,
    type: String,
  },
});



let Product = mongoose.model('products', productSchema);

// 自己建model
// let productOne = new Product({
//   itemName : 'Ball 梅森罐 4oz 窄口菱格紋',
//   price: 80,
//   introduction: ['Ball 24oz 寬口玻璃罐容量約 700 毫升', 'Ball 4oz 窄口菱格紋密封罐，容量約 120 毫升','美麗的菱格紋，特別適合盛裝果醬'],
//   description: ['經典的梅森罐，擺在家中也相當賞心悅目'],
//   specification: ['尺寸：Ø 6.5 x 高 5.9 cm', '容量：4oz，約 120 ml', '瓶圍：21 cm' , '重量：142 g', '口徑：窄口', '顏色：透明無色', '材質：玻璃、馬口鐵、橡膠', '產地：美國設計/美國製造'],
//   img: '/images/5.jpg',
// });

// console.log(productOne);
// productOne.save();


module.exports = {Product};