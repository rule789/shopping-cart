let desTab = document.querySelector('#des-tab');
let specTab = document.querySelector('#spec-tab');
let des = document.querySelector('.descript');
let spec = document.querySelector('.specification');

// 規格切換
$(desTab).on('click', function(e){
  e.preventDefault();
  $(desTab).find('a').addClass('active');
  $(specTab).find('a').removeClass('active');
  $(des).show();
  $(spec).hide();
});

// 產品說明切換
$(specTab).on('click', function(e){
  e.preventDefault();
  $(desTab).find('a').removeClass('active');
  $(specTab).find('a').addClass('active');
  $(des).hide();
  $(spec).removeClass('d-none').show();
});


// 加入購物車
$('.add-to-cart').on('click', function(){
  let item = document.querySelector('#itemName');
  // let itemName = $(item).text();
  // let price = $('.item-price').text();
  let hasAdded = parseInt(item.dataset.hasadded);
  let itemId = item.dataset.id;
  // console.log(itemId);

  if(hasAdded > -1){
    alert('購物車已有此商品');
  } else {
    $.ajax({
      url: '/cart/add',
      type: 'post',
      data: {
        _itemId : itemId,
      },
      success: function(data){
        // console.log(data);
        alert('已加入購物車');
        item.dataset.hasadded = '0';
      },
      error: function(e){
        console.log(e);
      }
    });

  }
});

