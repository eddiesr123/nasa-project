// const launches = require("./launches.mongo");
const launches = new Map();

let flightNbr = 100;

const firstLaunch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(firstLaunch.flightNumber, firstLaunch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  flightNbr++;

  const newLaunch = {
    flightNumber: flightNbr,
    ...launch,
    launchDate: new Date(launch.launchDate),
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  };

  launches.set(flightNbr, newLaunch);

  return newLaunch;
}

function abortLaunch(id) {
  if (launches.has(id)) {
    const abortedLaunch = launches.get(id);
    abortedLaunch.upcoming = false;
    abortedLaunch.success = false;
    return abortedLaunch;
  } else {
    return null;
  }
}

module.exports = { getAllLaunches, addNewLaunch, abortLaunch };
