const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const habitablePlanets = [];

const parser = parse({
  comment: "#",
  columns: true,
});

const isHabitable = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "../../data/kepler_data.csv"))
      .pipe(parser)
      .on("data", (planet) => {
        if (isHabitable(planet)) {
          habitablePlanets.push(planet);
        }
      })
      .on("error", ({ message }) => reject(message))
      .on("end", () => resolve());
  });
}

module.exports = {
  loadPlanetsData,
  planets: habitablePlanets,
};
