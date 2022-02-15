const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  const requestBody = {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  };
  try {
    const response = await axios.post(SPACEX_API_URL, requestBody);

    if (response.status !== 200) {
      throw new Error("Launch data download failed");
    }
    return response.data.docs;
  } catch (error) {
    console.error(`Could not populate launches ${error}`);
  }
}

async function loadLaunchesData() {
  const hasBeenLoaded = await launches.findOne({ rocket: "Falcon 1" });

  if (hasBeenLoaded) {
    console.log("Launch data has already been loaded");
    return;
  }

  let launchData = await populateLaunches();

  launchData.forEach(async (launch) => {
    const customers = launch.payloads.flatMap((payload) => payload.customers);

    await saveLaunch({
      flightNumber: launch.flight_number,
      mission: launch.name,
      rocket: launch.rocket.name,
      launchDate: launch.date_local,
      upcoming: launch.upcoming,
      success: launch.success,
      customers,
    });
  });
}

async function getLatestFlightNbr() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .limit(limit)
    .skip(skip);
}

async function saveLaunch(launch) {
  try {
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
  const planet = await planets.findOne({ keplerName: launch.target });

  try {
    if (!planet) {
      throw new Error("No matching planet was found");
    }

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
  } catch (error) {
    console.error(`Could not schedule launch ${error}`);
  }
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

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  loadLaunchesData,
};
