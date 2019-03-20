let perPrice = document.getElementsByClassName('perPrice');
let itemArea = $(perPrice).closest('tr');
let quantity = $(itemArea).find('.quantity');
let itemSum = $(itemArea).find('.itemSum');
let totalCost = $('.totalCost');

// calculate each item price
for(let i=0; i<perPrice.length; i++){
  let price = perPrice[i].textContent;
  itemSum[i].textContent = price* quantity[i].value;
}
totalCostChange(itemSum);


// change quantity so change cost
$('.cartContent').on('click', '.quantity', function(e){
  let whichItemArea = $(this).closest('tr');
  let whichItemId = $(whichItemArea).attr('data-id');
  let whichQuan = $(this).val();
  let whichPerPrice = $(whichItemArea).find('.perPrice').text();
  let whichItemSum = $(whichItemArea).find('.itemSum');
  $(whichItemSum).text( whichPerPrice*whichQuan);

  totalCostChange(itemSum);

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


// user change quantity by keyboard
$('.quantity').keyup(function(e){
  $('.quantity').click();
});


// delete item
$('.cartContent').on('click','.delBtn', function(e) {
  let whichItemArea = $(this).closest('tr');
  let whichItemId = $(whichItemArea).attr('data-id');
  let item = $(this).closest('tr');
  $(item).remove();
  perPrice = document.getElementsByClassName('perPrice');
  itemSum = document.getElementsByClassName('itemSum');

  totalCostChange(itemSum);

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
function totalCostChange(itemSum) {
  let total = 0;
  for(let i=0; i< itemSum.length; i++){
    total += parseInt(itemSum[i].textContent);
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