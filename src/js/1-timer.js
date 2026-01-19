import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { Ukrainian } from 'flatpickr/dist/l10n/uk.js';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userDate;

const options = {
  locale: Ukrainian,
  dateFormat: 'd.m.Y H:i',
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const nowTime = new Date();

    if (selectedDate <= nowTime) {
      iziToast.error({
        title: 'Помилка',
        message: 'Виберіть дату у майбутньому',
        position: 'topRight',
      });
      refs.startBtn.disabled = true;
    } else {
      userDate = selectedDate;
      refs.startBtn.disabled = false;
    }
  },
};

flatpickr(refs.input, options);

refs.startBtn.addEventListener('click', () => {
  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  let intervalId = setInterval(() => {
    const currentTime = new Date();
    const differenceTime = userDate - currentTime;

    if (differenceTime <= 0) {
      clearInterval(intervalId);
      timerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      refs.input.disabled = false;
      return;
    }

    const time = convertMs(differenceTime);
    timerDisplay(time);
  }, 1000);
});

function timerDisplay({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days).padStart(2, '0');
  refs.hours.textContent = String(hours).padStart(2, '0');
  refs.minutes.textContent = String(minutes).padStart(2, '0');
  refs.seconds.textContent = String(seconds).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
