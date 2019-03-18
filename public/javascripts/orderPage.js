let onePrice = document.getElementsByClassName('per-price');
let itemArea = $(onePrice).closest('tr');
let quantity = $(itemArea).find('.quantity');
let itemPrice = $(itemArea).find('.item-price');
let totalCost = $('.total-cost');


// calculate each item price
for(let i=0; i<onePrice.length; i++){
  let price = parseInt(onePrice[i].textContent);
  itemPrice[i].textContent = price* parseInt(quantity[i].textContent) + '元';
}

totalCostChange(itemPrice);

// calculate total cost
function totalCostChange(itemPrice) {
  let total = 0;
  for(let i=0; i< itemPrice.length; i++){
    total += parseInt(itemPrice[i].textContent);
  }
  $(totalCost).text(total);
}