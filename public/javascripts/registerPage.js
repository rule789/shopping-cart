let pwd = document.querySelector('#password');
let pwdCheck = document.querySelector('#password_Check');
let alert = document.querySelector('.alert');
let sendBtn = document.querySelector('#sendBtn');

$(alert).hide();

$(sendBtn).on('click', function(e){
  console.log(alert);
  if (pwd.value !== pwdCheck.value){
    e.preventDefault();
    $(alert).text('確認密碼不相同').show();
  } else {
    $(alert).hide();
  }

});


