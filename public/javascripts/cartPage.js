let onePrice = document.getElementsByClassName('per-price');
let itemArea = $(onePrice).closest('tr');
let quantity = $(itemArea).find('.quantity');
let itemPrice = $(itemArea).find('.item-price');
let totalCost = $('.total-cost');

// calculate each item price
for(let i=0; i<onePrice.length; i++){
  let price = onePrice[i].textContent;
  itemPrice[i].textContent = price* quantity[i].value;
}
totalCostChange(itemPrice);





// change quantity so change cost
$('.cart-content').on('click', '.quantity', function(e){
  let whichItemArea = $(this).closest('tr');
  let whichItemId = $(whichItemArea).attr('data-id');
  let whichQuan = $(this).val();
  let whichPerPrice = $(whichItemArea).find('.per-price').text();
  let whichItemPrice = $(whichItemArea).find('.item-price');
  $(whichItemPrice).text( whichPerPrice*whichQuan);
  // console.log(whichItemId);

  totalCostChange(itemPrice);

  $.ajax({
    url: '/cart/quantity',
    type: 'patch',
    data: {
      _itemId: whichItemId,
      quantity: whichQuan
    },
    success: function(data){
      console.log(data);
    },
    error: function(e){
      console.log('error');
    }
  });

});


// change quantity by keyboard
$('.quantity').keyup(function(e){
  $('.quantity').click();
});



// delete item
$('.cart-content').on('click','.del', function(e) {
  let whichItemArea = $(this).closest('tr');
  let whichItemId = $(whichItemArea).attr('data-id');
  let item = $(this).closest('tr');
  $(item).remove();
  onePrice = document.getElementsByClassName('per-price');
  itemPrice = document.getElementsByClassName('item-price');

  totalCostChange(itemPrice);
  console.log(onePrice, itemPrice);

  $.ajax({
    url: '/cart/remove',
    type: 'delete',
    data: {_itemId: whichItemId},
    success: function(data){
      console.log(data);
    },
    error: function(e){
      console.log('error');
    }
  });

});



// calculate total cost
function totalCostChange(itemPrice) {
  let total = 0;
  for(let i=0; i< itemPrice.length; i++){
    total += parseInt(itemPrice[i].textContent);
  }
  $(totalCost).text(total);
}

// 結帳時購物車沒商品
$('#checkout').on('click', function(e){
  if( $(totalCost).text() == '0'){
    e.preventDefault();
    alert('購物車無商品');
  }
});