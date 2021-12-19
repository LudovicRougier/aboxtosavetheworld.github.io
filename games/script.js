var cube = document.querySelector('.cube');
var radioGroup = document.querySelector('.radio-group');
let startBtn = document.querySelector('.start-btn');


startBtn.addEventListener('click', (event) => {
  cube.classList.add( 'show-right' );
});