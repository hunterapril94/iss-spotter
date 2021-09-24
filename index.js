const { fetchMyIP, fetchCoordinatesByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');
const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});

// fetchISSFlyOverTimes({ latitude: 49.2825, longitude: -123.1291 }, (err, body) => {
//   if(err) {
//     console.log(err)
//   } else {
//     console.log(body)
//   }
// });
// fetchCoordinatesByIP("24.80.125.48", (error, body) => {
//   if(error) {
//     console.log(error)
//   } else {
//     console.log(body)
//   }

// })
// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });