let pwd = document.querySelector('#password');
let pwdCheck = document.querySelector('#passwordCheck');
let alert = document.querySelector('.alert');
let sendBtn = document.querySelector('#sendBtn');


$(sendBtn).on('click', function(e){

  if (pwd.value !== pwdCheck.value){
    e.preventDefault();
    $(alert).text('確認密碼不相同').removeClass('d-none');
  } else {
    $(alert).addClass('d-none');
  }
});


