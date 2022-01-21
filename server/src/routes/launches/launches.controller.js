const { getAllLaunches, addNewLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  const requestNotValid =
    !launch.mission || !launch.rocket || !launch.launchDate || !launch.target;

  if (requestNotValid) {
    return res
      .status(400)
      .json({ error: "Missing required launch properties" });
  }

  const dateNotValid = isNaN(new Date(launch.launchDate));

  if (dateNotValid) {
    return res.status(400).json({ error: "Invalid launch date" });
  }

  const newLaunch = addNewLaunch(launch);
  return res.status(201).json(newLaunch);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch };
