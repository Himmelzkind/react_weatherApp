function formatDate(timestamp){
  //calculate the weekday and local time
  let date = new Date(timestamp);
  let weekDays = [ 
  "Sunday",
  "Monday", 
  "Tuesday", 
  "Wednesday", 
  "Thursday", 
  "Friday", 
  "Saturday"
  ];
  let day = weekDays[date.getDay()];
  let hour = date.getHours();
  let minutes = date.getMinutes();
  if (minutes.toString().length == 1) {
    minutes = "0" + minutes;
  }
  let time = `${hour}:${minutes}`;
  
  if (hour <=17 && hour >6) {
    document.getElementById("divmain_id").style.background = `linear-gradient(
      0deg, 
      rgba(0,0,0,0.6113795860140931) 0%, 
      rgba(150,150,150,0.3536765047816002) 39%, 
      rgba(224,224,224,0.06235997817095584) 100%),
    url("https://cdn.pixabay.com/photo/2018/08/21/23/29/fog-3622519__340.jpg")`;
  }

  let formattedDate = `${day} ${time}`;
  return formattedDate;
}

function displayTemperature(response){
    //exctract temperature, humidity and windspeed from openweathermap.org api
    let h1 = document.querySelector("h1").innerHTML= response.data.name;
    let temperatureElement = document.querySelector("#currentTemp");
    let humidityElement = document.querySelector("#humidity_wind");
    let h2 = document.querySelector("h2");

    let temperatureMax = Math.round(response.data.main.temp_max);
    let temperatureMin = Math.round(response.data.main.temp_min);
    let humidity = response.data.main.humidity;
    let windspeed = Math.round(response.data.wind.speed);
    let descriptionElement = response.data.weather[0].description;

    celsiusTemperatureMax = response.data.main.temp_max;
    celsiusTemperatureMin = response.data.main.temp_min;

    temperatureElement.innerHTML = `<strong>${temperatureMax}°</strong>|${temperatureMin}`;
    humidityElement.innerHTML = `humidity: ${humidity} % | windspeed: ${windspeed} km/h`;
    h2.innerHTML = formatDate(response.data.dt * 1000);
    
    //change main weather icon
    let iconElement = document.querySelector("#icon-main");
    
    iconElement.setAttribute(
    "src", 
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute(
        "alt",
        `${descriptionElement}`
    );

}

function formatDay(timestamp) {
  let date = new Date(timestamp);
  let weekDays = [ 
  "su",
  "mo", 
  "tu", 
  "we", 
  "th", 
  "fr", 
  "sa"
  ];
  let day = weekDays[date.getDay()];
  return day
}

function displayForecast(response){
  let forecastElement = document.querySelector(".forecast_bottom");

  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.daily[index];

    forecastElement.innerHTML += `
  
        <div class="col-2">
          <h3>${formatDay(forecast.dt * 1000)}</h3>
          <img class="forecast-icon" src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
          <div class="weather-forecast-temp">
            <strong>${Math.round(forecast.temp.max)}°</strong>|${Math.round(forecast.temp.min)}°
          </div>
        </div>
      
    `;
  }

}

function getCoordinates(response){
  // get coordinates from submitted city name
  let longitude = response.data.coord.lon;
  let latitude = response.data.coord.lat;

  //search for forcast temperature
  let apiKey = "c0ceae1b9bc9cde459831675fe59f1d6";
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function search(city) {
  // set up api requirements
  let apiKey = "c0ceae1b9bc9cde459831675fe59f1d6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
  //set up axios for api and get temperature
  axios.get(apiUrl).then(displayTemperature);

  //get coordinates
  axios.get(apiUrl).then(getCoordinates); 
}

function handleSubmit(event) {
  // catch submit input = city name
  event.preventDefault();
  let cityInputElement = document.querySelector("#inlineFormInput");

  // and hand over to api request
  search(cityInputElement.value);
}

function searchLocation(position){
  // get current location (coordinates) of your device and pass them on to display temperature of your location
  //position.preventDefault();
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "361119f7d767ce895ccf917d2e91cc83";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(weatherUrl).then(displayTemperature);

  // display forecast
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getCurrentLocation(event){
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayFahrenheit(event){
  event.preventDefault();
  //remove the active class of the celsius link and add the active class to the fahrenheit link
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  // calculate fahrenheit temperature
  let fahrenheitTemperatureMax = (celsiusTemperatureMax * 9) / 5 + 32;
  let fahrenheitTemperatureMin = (celsiusTemperatureMin * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#currentTemp");
  temperatureElement.innerHTML = `<strong>${Math.round(fahrenheitTemperatureMax)}°</strong>|${Math.round(fahrenheitTemperatureMin)}`;
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  // remove the active class of the fahrenheit link and add the active class to the celsius link
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  
  let temperatureElement = document.querySelector("#currentTemp");
  temperatureElement.innerHTML = `<strong>${Math.round(celsiusTemperatureMax)}°</strong>|${Math.round(celsiusTemperatureMin)}`;
}

let celsiusTemperatureMax = null;
let celsiusTemperatureMin = null;

//
// application starts with temperature for location...
search("Tokyo");

//control search and submit form
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

// get weather for current location
let currentButton = document.querySelector("#location-button");
currentButton.addEventListener("click", getCurrentLocation);

// call unit converter
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click",displayFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click",displayCelsiusTemperature);


