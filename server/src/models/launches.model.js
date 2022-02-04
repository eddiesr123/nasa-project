const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

async function getLatestFlightNbr() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  try {
    if (!planet) {
      throw new Error("No matching planet was found");
    }

    await launches.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true }
    );
  } catch (error) {
    console.error(`Could not save launch ${error}`);
  }
}

async function addNewLaunch(launch) {
  const flightNumber = (await getLatestFlightNbr()) + 1;
  const newLaunch = {
    flightNumber,
    ...launch,
    launchDate: new Date(launch.launchDate),
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  };
  await saveLaunch(newLaunch);

  return newLaunch;
}

async function abortLaunch(id) {
  const launch = await launches.findOne(
    { flightNumber: id },
    { _id: 0, __v: 0 }
  );

  if (!launch) {
    return null;
  }

  launch.upcoming = false;
  launch.success = false;

  const aborted = await launches.updateOne({ flightNumber: id }, launch);

  return aborted.modifiedCount === 1;
}

module.exports = { getAllLaunches, addNewLaunch, abortLaunch };
