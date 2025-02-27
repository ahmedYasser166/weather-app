const APIKey = "7c5a03a8ffa94134840132326241212";
const baseURL = "https://api.weatherapi.com/v1/forecast.json";

const findInput = document.querySelector("#findInput");
const btnFind = document.querySelector("#btnFind");
const forecastContainer = document.querySelector("#forecast");

async function fetchWeather(city) {
  try {
    const response = await fetch(`${baseURL}?key=${APIKey}&q=${city}&days=3`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch weather data.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function displayWeather(city = "Cairo") {
  const data = await fetchWeather(city);
  if (!data) {
    forecastContainer.innerHTML = `<div class="error-container">
                  <h1><i class="fa-solid fa-triangle-exclamation"></i></h1>
                <p class="error-text">City "<strong>${city}</strong>" not found! Please try again.</p>
            </div>`;
    return;
  }

  forecastContainer.innerHTML = "";
  data.forecast.forecastday.forEach((day, index) => {
    const dayName = new Date(day.date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const sunrise = day.astro.sunrise;
    const sunset = day.astro.sunset;
    const humidity = day.day.avghumidity;
    const windSpeed = day.day.maxwind_kph;
    const pressure = day.hour[0].pressure_mb;
    const cloud = day.day.cloud;
    let extraClass = index === 0 ? "today-card" : "forecast-card";

    forecastContainer.innerHTML += `
            <div class="col-lg-4">
                <div class="card ${extraClass}" id="${
      index === 0 ? "today-weather" : ""
    }">
                    <div class="card-header">${dayName} - ${
      data.location.name
    }, ${data.location.country}</div>
                    <div class="card-body">
                        <p><strong>Temperature:</strong> ${
                          day.day.maxtemp_c
                        }°C / ${day.day.mintemp_c}°C</p>
                        <img src="${day.day.condition.icon}" alt="Weather Icon">
                        <p><strong>Condition:</strong> ${
                          day.day.condition.text
                        }</p>
                        <p><strong>Humidity:</strong> ${humidity}%</p>
                        <p><strong>Wind Speed:</strong> ${windSpeed} km/h</p>
                        <p><strong>Pressure:</strong> ${pressure} mb</p>
                        <p><strong>Cloud Cover:</strong> ${cloud}%</p>
                        <p><strong>Sunrise:</strong> ${sunrise}</p>
                        <p><strong>Sunset:</strong> ${sunset}</p>
                    </div>
                </div>
            </div>
        `;
  });
}
findInput.addEventListener("input", function () {
  const city = findInput.value.trim();
  if (city.length > 0) {
    displayWeather(city);
  }
});

document.addEventListener("DOMContentLoaded", () => displayWeather("Cairo"));
btnFind.addEventListener("click", () => displayWeather(findInput.value.trim()));
