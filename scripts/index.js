const API_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const previousWeatherToggle = document.querySelector(".show-previous-weather");

const previousWeather = document.querySelector(".previous-weather");

const currentSolElement = document.querySelector("[data-current-sol]");
previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});
let selectSolIndex;
getWeather().then((sols) => {
  selectSolIndex = sols.length - 1;
  displaySelectedSol(sols);
});

function displaySelectedSol(sols) {
  const selectedSol = sols[selectSolIndex];

  currentSolElement.innerText = selectedSol.sol;
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
