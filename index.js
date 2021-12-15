// Import stylesheets
import './style.css';
import faker from 'faker';
import moment from 'moment';

// Fake Date of Births
let maxAge = moment().subtract(100, 'y').utc().toISOString();
let minAge = moment().subtract(7, 'y').utc().toISOString();
let fakeDOB = faker.date.between(minAge, maxAge).toISOString();

// Fake Timeslots
const minFutureDate = moment().add(6, 'M').utc().toISOString();
const maxFutureDate = moment().add(1, 'd').utc().toISOString();
// Calcualte to nearest min
const timeslot = moment(faker.date.between(minFutureDate, maxFutureDate));
const savedTimeslot = timeslot.utc().toISOString();
const remainder = 30 - moment(timeslot.minute() % 30);

const currentTime = parseInt(moment(timeslot).utc().format('HH'));
console.log('currentTime: ', currentTime);

// Business Hours Validation.
// -> Convert to time format
let endCurrrentTime = 0;
if (currentTime > 17) {
  let x = currentTime - 12;
  console.info('Greater', x);
  if (x < 9) x += 4;
  endCurrrentTime = x;
}

if (currentTime < 9) {
  let x = currentTime + 12;
  console.info('Smaller', x);
  if (x > 17) x -= 4;
  endCurrrentTime = x;
}

// Add a further function to avoid lunch hour.

console.log('[END TIME]=>', endCurrrentTime);

const updatedTimeSlot =
  endCurrrentTime === 0 ? timeslot : moment(timeslot).hour(endCurrrentTime);
console.log('[UPDATED]=>', updatedTimeSlot);

const timeslotStart = moment(timeslot)
  .add(remainder, 'm')
  .startOf('minute')
  .toISOString();

const timeslotEnd = moment(timeslotStart).add(30, 'm').toISOString();
// console.log(timeslotStart, '||', timeslotEnd);

// Final Object
const dateObject = {
  startTime: timeslotStart,
  endTime: timeslotEnd,
};

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `
  <p>DOB: ${fakeDOB}</p>
  <h2>Saved:${savedTimeslot}</h2>
  Remainder ${remainder}.
  <br/> Start: ${dateObject.startTime}
  <br/> End:   .${dateObject.endTime}
`;
