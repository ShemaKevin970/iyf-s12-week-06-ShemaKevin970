const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || window.API_KEY || "your_api_key_here";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const MAX_RECENT = 5;

// DOM elements (given)
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");
const historyList = document.getElementById("search-history");

const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

// STEP 1 — fetchWeather(city)
async function fetchWeather(city) {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) throw new Error("City not found");
    if (response.status === 401) throw new Error("API key not valid yet — wait 10-20 minutes after you create it");
    throw new Error("Failed to fetch weather data");
  }
  return response.json();
}

// STEP 2 — getWeather(city)
async function getWeather(city) {
  if (typeof API_KEY === "undefined" || !API_KEY) {
    showError("Missing API key: copy config.example.js to config.js and add your key");
    return;
  }
  showLoading();
  hideError();
  try {
    const data = await fetchWeather(city);
    displayWeather(data);
    saveToHistory(data.name);
  } catch (err) {
    showError(err.name === "TypeError" ? "Network error — check your connection" : err.message);
  } finally {
    hideLoading();
  }
}

// STEP 3 — displayWeather(data)
function displayWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} m/s`;
  pressure.textContent = `${data.main.pressure} hPa`;
  weatherDisplay.classList.remove("hidden");
}

// Helpers (given)
function showLoading() { loading.classList.remove("hidden"); weatherDisplay.classList.add("hidden"); }
function hideLoading() { loading.classList.add("hidden"); }
function showError(message) { errorBox.textContent = message; errorBox.classList.remove("hidden"); }
function hideError() { errorBox.classList.add("hidden"); }

// STEP 4 — recent searches in localStorage
function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem("recent")) || [];
  } catch {
    return [];
  }
}
function saveToHistory(city) {
  recent = recent.filter(c => c.toLowerCase() !== city.toLowerCase());
  recent.unshift(city);
  if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
  localStorage.setItem("recent", JSON.stringify(recent));
  renderHistory();
}
function renderHistory() {
  historyList.innerHTML = "";
  recent.forEach(city => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "history-item";
    btn.textContent = city;
    li.appendChild(btn);
    historyList.appendChild(li);
  });
}
let recent = loadRecent();

// STEP 5 — events
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

historyList.addEventListener("click", (event) => {
  const btn = event.target.closest(".history-item");
  if (btn) {
    getWeather(btn.textContent);
  }
});

renderHistory();