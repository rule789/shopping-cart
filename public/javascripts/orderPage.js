let onePrice = document.getElementsByClassName('perPrice');
let itemArea = $(onePrice).closest('tr');
let quantity = $(itemArea).find('.quantity');
let itemSum = $(itemArea).find('.itemSum');
let totalCost = $('.totalCost');


// calculate each item price
for(let i=0; i<onePrice.length; i++){
  let price = parseInt(onePrice[i].textContent);
  itemSum[i].textContent = price* parseInt(quantity[i].textContent) + '元';
}

totalCostChange(itemSum);

// calculate total cost
function totalCostChange(itemSum) {
  let total = 0;
  for(let i=0; i< itemSum.length; i++){
    total += parseInt(itemSum[i].textContent);
  }
  $(totalCost).text(total);
}