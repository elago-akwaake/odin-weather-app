import 'normalize.css';
import './style.css';
window.addEventListener('DOMContentLoaded', function () {
	/* Get DOM elements:
	 * all the display elements we need to manipulate
	 * form
	 * form's input (we need to get the value)
	 *  */
	let container = document.getElementById('container');
	let weatherIconImage = document.getElementById('weatherIcon');
	let temperatureDegreeDisplay = document.getElementById('temperatureDegree');
	let weatherConditionDisplay = document.getElementById('weatherCondition');
	let weatherDesriptionDisplay = document.getElementById('weatherDescription');
	let cityDisplay = document.getElementById('city');
	let countryDisplay = document.getElementById('country');
	let searchForm = document.getElementById('searchForm');
	let searchInput = document.getElementById('searchInput');
	let loadingWheel = document.getElementById('loadingWheel');
	let loadingOverlay = document.getElementById('loadingOverlay');
	/* ========================================================= */
	/* Create a global variable and a class to store weather data
	 * currentWeather */

	let currentWeather;

	class Weather {
		constructor(city, country, tempKelvin, weatherCondition, weatherDescription, weatherIcon) {
			this.city = city;
			this.country = country;
			this.tempKelvin = Number(tempKelvin);
			this.weatherCondition = weatherCondition;
			this.weatherDescription = weatherDescription;
			this.weatherIcon = weatherIcon;
		}

		getCelcius() {
			return Math.round(this.tempKelvin - 273.15);
		}

		getFahrenheit() {
			return Math.round((this.tempKelvin - 273.15) * (9 / 5) + 32);
		}
	}
	/* ========================================================= */
	// EVENT LISTENERS
	// 04 Set up a simple form that will let users input their location
	// and will fetch the weather info(still just console.log() it).
	searchForm.addEventListener('submit', (e) => {
		e.preventDefault();
		if (searchInput.value !== '' && searchInput.value !== ' ') {
			callWeatherApi(searchInput.value);
		} else {
			if (searchInput.value === ' ') {
				showErrorMessage('You entered a space.');
			} else {
				showErrorMessage('Enter a valid location.');
			}
		}
	});

	// PROGRAM
	callWeatherApi();

	/* ========================================================= */
	// FUNCTIONS
	/* ========================================================= */
	// 02 Write the functions that hit the API and fetch data
	function callWeatherApi(city = 'Windhoek') {
		displayLoading();
		// * Format city name for url
		let lower = city.toLowerCase();
		let words = lower.split(' ');
		let search = words.join('+');
		let cityName = search;

		// * Call API
		// OpenWeather API: 5017fbfd06e50faffa83ae57bed333
		let apiKey = '5017fbfd06e50faffa83ae57bed3330f';
		let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

		// * Get Response Promise
		// * Check for any error in the status code
		// * Return the resolved promise to json
		// * Catch the rejected promise in catch
		// * Then
		fetch(url, { mode: 'cors' })
			.then((response) => {
				hideLoading();

				if (response.status === 401) {
					throw new Error('API key error.');
				}
				if (response.status === 404) {
					showErrorMessage('Enter a valid location.');
					throw new Error('Specified the wrong city name, ZIP-code or city ID.');
				}
				if (!response.ok) {
					showErrorMessage(`Error ${response.status}`);
					throw new Error(response.status);
				}
				return response.json();
			})
			.then((data) => setCurrentWeather(data))
			.catch((error) => {
				console.log('catch:', error);
			});
	}

	// 03 Write the functions that process the JSON data you’re getting from the API
	// and return an object with only the data you require for your app
	function setCurrentWeather(apiWeatherData) {
		console.log('weather', apiWeatherData);
		// Create a new Weather object using values from the apiWeatherData
		currentWeather = new Weather(
			apiWeatherData.name,
			apiWeatherData.sys.country,
			apiWeatherData.main.temp,
			apiWeatherData.weather[0].main,
			apiWeatherData.weather[0].description,
			apiWeatherData.weather[0].icon
		);
		console.log(currentWeather);
		displayCurrentWeather(currentWeather);
	}

	function displayCurrentWeather(weatherObj) {
		weatherIconImage.src = getWeatherIconSRC(weatherObj.weatherIcon);
		temperatureDegreeDisplay.innerText = weatherObj.getCelcius();
		weatherConditionDisplay.innerText = weatherObj.weatherCondition;
		weatherDesriptionDisplay.innerText = weatherObj.weatherDescription;
		cityDisplay.innerText = weatherObj.city;
		countryDisplay.innerText = weatherObj.country;
	}

	function getWeatherIconSRC(iconCode) {
		let url = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
		return url;
	}

	function showErrorMessage(msg = 'Enter a valid location') {
		const errorDiv = document.createElement('div');
		errorDiv.classList.add('error-message');
		errorDiv.innerText = msg;
		container.insertBefore(errorDiv, searchForm);
		setTimeout(() => {
			container.removeChild(errorDiv);
		}, 2000);
	}

	function displayLoading() {
		loadingWheel.classList.add('loading');
		loadingOverlay.classList.add('loading');
	}

	function hideLoading() {
		loadingWheel.classList.remove('loading');
		loadingOverlay.classList.remove('loading');
	}
});
