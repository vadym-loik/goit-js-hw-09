import flatpickr from 'flatpickr';
// Дополнительный импорт стилей
import 'flatpickr/dist/flatpickr.min.css';

import Notiflix from 'notiflix';

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0].getTime();
    const currentDate = Date.now();
    if (currentDate > selectedDate) {
      Notiflix.Notify.failure('Please choose a date in the future');
      return;
    }
    refs.startBtn.disabled = false;
  },
};

const refs = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  startBtn: document.querySelector('[data-start]'),
};

refs.startBtn.disabled = true;

flatpickr('#datetime-picker', options);

const datePicker = flatpickr('#datetime-picker', options);

const timer = {
  intervalId: null,
  isActive: false,

  start() {
    if (this.isActive) {
      return;
    }
    const startTime = datePicker.selectedDates[0];
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = startTime - currentTime;
      if (deltaTime < 0) {
        clearInterval(this.intervalId);
        this.isActive = false;
        return;
      }
      const timeComponents = convertMs(deltaTime);
      updateClockface(timeComponents);
    }, 1000);
  },
};

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateClockface({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

refs.startBtn.addEventListener('click', () => {
  timer.start();
});
