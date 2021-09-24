const request = require('request-promise-native');

const fetchMyIP = function () {
  return request('https://api.ipify.org?format=json');
}

const fetchCoordsByIP = function(body) {
  let ip = JSON.parse(body).ip;
  return request('https://freegeoip.app/json/' + ip)
};
const fetchISSFlyOverTimes = function(body) {
  let longitude = JSON.parse(body).longitude;
  let latitude = JSON.parse(body).latitude;
  return request('https://iss-pass.herokuapp.com/json/?lat=' + latitude + '&lon=' + longitude)
}

const nextISSTimesForMyLocation = fetchMyIP().then(fetchCoordsByIP).then(fetchISSFlyOverTimes).then((body) => {
  const response = JSON.parse(body).response
  return response;
})
module.exports = nextISSTimesForMyLocation