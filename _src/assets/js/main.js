'use strict';
const keys = document.querySelectorAll('.key');

function playWav(ev) {
  const audio = document.querySelector(`audio[data-key="${ev.keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${ev.keyCode}"]`);
  if (!audio) return;
  audio.currentTime = 0;
  audio.play();
  key.classList.add('playing');
};


function removeTransition(ev) {
  if (ev.propertyName !== 'transform') return;
  this.classList.remove('playing');
};

keys.forEach(key => key.addEventListener('transitionend', removeTransition));
window.addEventListener('keydown', playWav);
