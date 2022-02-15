const {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
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

  const newLaunch = await addNewLaunch(launch);
  return res.status(201).json(newLaunch);
}

async function httpAbortLaunch(req, res) {
  const id = Number(req.params.id);
  const aborted = await abortLaunch(id);
  const notFound = aborted === null;
  const notAborted = aborted === false;

  if (notFound) {
    return res.status(404).json({ error: "Launch not found" });
  }

  if (notAborted) {
    return res.status(400).json({ error: "Launch not aborted" });
  }

  return res.status(200).json({ ok: true });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
