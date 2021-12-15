// Import stylesheets
import './style.css';
import faker from 'faker';
import moment from 'moment';

// =======  Faker / Moment Date of Birth Generator  ===============
const fakeDOB = (min, max) => {
  const minAge = moment().subtract(min, 'y').utc().toISOString();
  const maxAge = moment().subtract(max, 'y').utc().toISOString();
  return faker.date.between(minAge, maxAge).toISOString();
};

const dateOfBirth = fakeDOB(17, 100);
// ====================== End Of Function ==========================
const businessHourHack = (hour) => {
  // This feature is not supposed to be 'efficient' or 'correct'
  // The goal is to simply provide more accurate fake data
  // within the business hours of 9 - 6 PM.
  let hourSlot = 0;
  if (hour > 17) {
    let x = hour - 12;
    if (x < 9) x += 4;
    hourSlot = x;
  }

  if (hour < 9) {
    let x = hour + 12;
    if (x >= 17) x-= 4;
    hourSlot = x;
  }

  return hourSlot;
}


const fakeAppointmentTimeSlot = (min, max, remainder) => {
  const minDate = moment().add(min, 'M').utc().toISOString();
  const maxDate = moment().add(max, 'd').utc().toISOString();
  const proposedTimeSlot = moment(faker.date.between(minDate, maxDate));
  // 1. Verify generated Faker Data
  const proposedTimeStatic = proposedTimeSlot.utc().toISOString();
  console.info('ProposedTimeSlot => ', proposedTimeStatic);
  // 2. Remainder is 30 min intervals for appointments.
  const roundUpMins = remainder - moment(proposedTimeSlot.minute() % remainder);
  // 3. Proposed Hour - Business Hours. (Default = 9 - 5)
  const proposedHour = parseInt(moment(proposedTimeSlot).utc().format('HH'));
  // 4. Validate Proposed Time
  let slotTime = 0;
  if (proposedHour > 17) {
    let x = proposedHour - 12;
    if (x < 9) x += 4;
    slotTime = x;
  }

  if (proposedHour < 9) {
    let x = proposedHour + 12;
    if (x >= 17) x-= 4;
    slotTime = x;
  }
  console.log('Slot Time => ', slotTime);
  // 5. Change ProposedTime to alternate time within Business Hours
  const validatedTimeSlot = slotTime === 0 ? proposedTimeSlot : moment(proposedTimeSlot).hour(slotTime);
  // 6. Prepare Timie slot object for Appointment/Calendar
  const startTime = moment(validatedTimeSlot)
  .add(roundUpMins, 'm')
  .startOf('minute')
  .toISOString();
  const endTime = moment(startTime).add(30, 'm').toISOString();
  console.log('Result: ', {
    minDate,
    maxDate,
    proposedTimeSlot,
    proposedTimeStatic,
    roundUpMins,
    proposedHour,
    slotTime,
    startTime,
    endTime
  });
  return { startTime, endTime }
}

const timeSlot = fakeAppointmentTimeSlot(6,1, 30);
console.log(timeSlot); 
// // Fake Timeslots
// const minFutureDate = moment().add(6, 'M').utc().toISOString();
// const maxFutureDate = moment().add(1, 'd').utc().toISOString();
// // Calcualte to nearest min
// const timeslot = moment(faker.date.between(minFutureDate, maxFutureDate));
// const savedTimeslot = timeslot.utc().toISOString();
// const remainder = 30 - moment(timeslot.minute() % 30);

// const currentTime = parseInt(moment(timeslot).utc().format('HH'));
// console.log('currentTime: ', currentTime);

// // Business Hours Validation.
// let endCurrrentTime = 0;
// if (currentTime > 17) {
//   let x = currentTime - 12;
//   console.info('Greater', x);
//   if (x < 9) x += 4;
//   endCurrrentTime = x;
// }

// if (currentTime < 9) {
//   let x = currentTime + 12;
//   console.info('Smaller', x);
//   if (x >= 17) x -= 4;
//   endCurrrentTime = x;
// }

// console.log('[END TIME]=>', endCurrrentTime);

// const updatedTimeSlot =
//   endCurrrentTime === 0 ? timeslot : moment(timeslot).hour(endCurrrentTime);

// console.log('[UPDATED]=>', updatedTimeSlot);

// const timeslotStart = moment(updatedTimeSlot)
//   .add(remainder, 'm')
//   .startOf('minute')
//   .toISOString();

// const timeslotEnd = moment(timeslotStart).add(30, 'm').toISOString();

// Final Object
const dateObject = {
  startTime: timeSlot.startTime,
  endTime: timeSlot.endTime,
};

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `
  <h2>DOB: ${dateOfBirth}</h2>
  <hr/>
  <h2>Saved:{savedTimeslot}</h2>
  <p>
    Remainder {remainder}.
    <hr />
  </p>  
  <p>
    <br/> Start: ${dateObject.startTime}
    <br/> End:   .${dateObject.endTime}
  </p>
`;
