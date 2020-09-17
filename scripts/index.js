const API_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const previousWeatherToggle = document.querySelector(".show-previous-weather");

const previousWeather = document.querySelector(".previous-weather");

const currentSolElement = document.querySelector("[data-current-sol]");
const currentDateElement = document.querySelector("[data-current-date]");
const currentTempHighElement = document.querySelector(
  "[data-current-temp-high]"
);
const currentTempLowElement = document.querySelector("[data-current-temp-low]");
const WindSpeedElement = document.querySelector("[data-wind-speed]");
const WindDirectionTextElement = document.querySelector(
  "[data-wind-direction-text]"
);
const WindDirectionArrowElement = document.querySelector(
  "[data-wind-direction-arrow]"
);

const previousSoulTemplate = document.querySelector(
  "[data-previous-sols-template]"
);
const previousSoulContainer = document.querySelector("[data-previous-sols]");

const unitToggle = document.querySelector("[data-unit-toggle]");

previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});
let selectSolIndex;
getWeather().then((sols) => {
  selectSolIndex = sols.length - 1;
  displaySelectedSol(sols);
  displayPreviousSols(sols);
  unitToggle.addEventListener("click", () => {});
});

function displaySelectedSol(sols) {
  const selectedSol = sols[selectSolIndex];

  currentSolElement.innerText = selectedSol.sol;
  currentDateElement.innerText = displayDate(selectedSol.date);
  currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp);
  currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp);
  WindSpeedElement.innerText = displaySpeed(selectedSol.windSpeed);
  WindDirectionArrowElement.style.setProperty(
    "--direction",
    `${selectedSol.windDirectionDegrees}deg`
  );
  WindDirectionTextElement.innerText = selectedSol.windDirectionCardinal;
}

function displayDate(date) {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });
}

function displayPreviousSols(sols) {
  previousSoulContainer.innerHTML = "";
  sols.forEach((solData, index) => {
    const solContainer = previousSoulTemplate.content.cloneNode(true);
    solContainer.querySelector("[data-sol]").innerText = solData.sol;
    solContainer.querySelector("[data-date]").innerText = displayDate(
      solData.date
    );
    solContainer.querySelector(
      "[data-temp-high]"
    ).innerText = displayTemperature(solData.maxTemp);
    solContainer.querySelector(
      "[data-temp-low]"
    ).innerText = displayTemperature(solData.minTemp);
    solContainer
      .querySelector("[data-select-button]")
      .addEventListener("click", () => {
        selectSolIndex = index;
        displaySelectedSol(sols);
      });
    previousSoulContainer.appendChild(solContainer);
  });
}

function displayTemperature(temp) {
  return Math.round(temp);
}

function displaySpeed(speed) {
  return Math.round(speed);
}

function getWeather() {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const { sol_keys, validity_checks, ...solData } = data;
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: data.HWS?.av || 7.2,
          windDirectionDegrees: data.WD?.most_common?.compass_degrees || 293,
          windDirectionCardinal: data.WD?.most_common?.compass_point || "WNW",
          date: new Date(data.First_UTC),
        };
      });
    });
}
