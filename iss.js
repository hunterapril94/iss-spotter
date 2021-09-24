/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    let ip = JSON.parse(body).ip;
    if (error) {
      body = null;
      callback(error, body);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      callback(null, ip);
      return ip;
    }

  });
};

const fetchCoordinatesByIP = function(ip, callback) {
  request('https://freegeoip.app/json/' + ip, (error, response, body) => {
    if (error) {
      body = null;
      callback(error, body);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
    } else {
      let lat = JSON.parse(body).latitude;
      let long = JSON.parse(body).longitude;
      callback(null, {"latitude": lat, "longitude" : long});
      return JSON.parse(body);
    }
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  request('https://iss-pass.herokuapp.com/json/?lat=' + coords.latitude + "&lon=" + coords.longitude, (error, response, body) => {
    if (error) {
      body = null;
      callback(error, body);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
    } else {
      const passes = JSON.parse(body).response
      callback(null, passes);
      return passes;
    }
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordinatesByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};
module.exports = { fetchMyIP, fetchCoordinatesByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };