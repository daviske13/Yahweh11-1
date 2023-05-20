// script.js
const API_KEY = api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}; 

// Elements
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const historyList = document.getElementById('history-list');

// Event listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        searchWeather(city);
        cityInput.value = '';
    }
    });

    historyList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const city = e.target.textContent;
        searchWeather(city);
    }
});

/ Function to search weather data
function searchWeather(city) {
    // Fetch coordinates for the city
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
        const { lat, lon } = data.coord;
        fetchWeatherForecast(lat, lon, city);
        addToHistory(city);
        })
        .catch(error => {
        console.log('Error:', error);
        alert('An error occurred while fetching weather data.');
        });
    }

// Function to fetch weather forecast using coordinates
function fetchWeatherForecast(lat, lon, city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
        displayCurrentWeather(data, city);
        displayForecast(data);
        })
        .catch(error => {
        console.log('Error:', error);
        alert('An error occurred while fetching forecast data.');
        });
    }

    // Function to display current weather
    function displayCurrentWeather(data, city) {
    currentWeather.innerHTML = `
    <h2>${city} (${new Date().toLocaleDateString()})</h2>
    <img src="https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png" alt="${data.list[0].weather[0].main}">
    <p>Temperature: ${convertKelvinToCelsius(data.list[0].main.temp)}°C</p>
    <p>Humidity: ${data.list[0].main.humidity}%</p>
    <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>
    `;
    }

    // Function to display forecast
    function displayForecast(data) {
    forecast.innerHTML = '';
    const forecastItems = data.list.slice(1, 6);

    forecastItems.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString();
        const icon = item.weather[0].icon;
        const temperature = convertKelvinToCelsius(item.main.temp);
        const humidity = item.main.humidity;
        const windSpeed = item.wind.speed;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
        <p>${date}</p>
        <img src="https://openweathermap.org/img/w/${icon}.png" alt="${item.weather[0].main}">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        `;