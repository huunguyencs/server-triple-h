const geoip = require('geoip-lite');

function ip2position(ip) {
  try {
    const geo = geoip.lookup(ip);
    return {
      latitude: geo.ll[0],
      longitude: geo.ll[1]
    };
  } catch (err) {
    return {
      latitude: 0,
      longitude: 0
    };
  }
}

function distance(pos1, pos2) {
  let lon1 = pos1.longitude;
  let lon2 = pos2.longitude;
  let lat1 = pos1.latitude;
  let lat2 = pos2.latitude;
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return c * r;
}

module.exports = { ip2position, distance };
