'use strict';

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Utility functions                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function addListener(eventType, element, fn) {
  return element.addEventListener(eventType, fn);
}

function getElement(selector) {
  return document.querySelector(selector);
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*   main code                                            */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */

const clock = getElement('.time');
const hr = getElement('.hour');
const min = getElement('.minutes');
const alert = getElement('.alarm span');
const activate = getElement('.set');
let currentTime = null;
const futureTime = new Date();
let alarmSet = false;

const sound = new Audio('./assets/audio/alarm.wav');
sound.type = 'audio/wav';

function resetInputs() {
  hr.value = '';
  min.value = '';
}

addListener('load', window, () => {
  resetInputs();
});

function padNumber(num) {
  return num.toString().padStart(2, '0');
};

const timeFormat = {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit'
}

function updateTimeDisplay() {
  let previous = 0;
  const update = currentTime => {
    if (previous === 0 || currentTime - previous >= 1000) {
      previous = currentTime;
      clock.innerText = new Date().toLocaleTimeString('en-ca', timeFormat);
    }
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function checkTime(first, second) {
  let firstTime = `${first.getHours()}${first.getMinutes()}${first.getSeconds()}`;
  let secondTime = `${second.getHours()}${second.getMinutes()}${second.getSeconds()}`;

  if (firstTime === secondTime) {
    clock.classList.add('green');
    sound.play();
    alarmSet = false;
    setTimeout(() => { clock.classList.remove('green'); }, 6800);
  }
}

setInterval(() => {
  currentTime = new Date();
  if (alarmSet) checkTime(currentTime, futureTime);
}, 1000);

addListener('input', clock, () => {
  let hr = clock.value.trim();
  if (hr.length === 2) {
    clock.value = `${hr}:`;
  }
});

addListener('input', hr, () => {
  let regex = /^\d+$/;
  let input = hr.value.trim();
  if (!regex.test(input)) hr.value = '';
});

addListener('input', min, () => {
  let regex = /^\d+$/;
  let input = min.value.trim();
  if (!regex.test(input)) min.value = '';
});

function checkValid(input, limit, element) {
  if (input.length === 2 && parseInt(input) >= 0 && parseInt(input) <= limit) {
    return true;
  }

  element.focus();
  return false;
}

addListener('click', activate, () => {
  let h = hr.value;
  let m = min.value;

  if (checkValid(h, 23, hr) && checkValid(m, 59, min)) {
    alert.innerText = `${h}:${m}`;
    futureTime.setHours(h);
    futureTime.setMinutes(m);
    futureTime.setSeconds(0);
    alarmSet = true;
    resetInputs();
  }
});

updateTimeDisplay();
