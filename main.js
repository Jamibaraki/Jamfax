const key=CONFIG.WEATHER_API_KEY;
const base="https://api.weatherapi.com/v1/";
const endpoint="current.json?q="
const parameters=CONFIG.WEATHER_LOCATION;
const url=base+endpoint+parameters+"&key="+key;

const token="0";
const sports_url="http://localhost:3000/matches";

class WeatherDataObject {
  temperature;
  windspeed;
  summary;//condition: rainy, sunny, etc
  summarypicurl;
  feelslike;
}

if( CONFIG.DEV_MODE == 1 ){
  document.getElementById("target").style.visibility="visible";
} else {
  document.getElementById("target").style.visibility="hidden";
}

if( CONFIG.LOAD_WEATHER == 1 ){
  loadWeather();
} else {
  document.getElementById("weather-card").innerHTML=`weather disabled`;
}

if( CONFIG.LOAD_SPORTS == 1 ){
  loadSports();
} else {
  document.getElementById("sports-card").innerHTML=`sports disabled`;
}

function loadSports(){

fetch(sports_url, {
  method: "GET",
  headers: {
    "X-Auth-Token": token
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {

  //renderSports(sportsdata);

  console.log(data);
  //console.log(sportsdata);
})
.catch(error => {
  console.error('Error:', error);
  document.getElementById("target").value = "network error";
  document.getElementById("sports-card").innerHTML =
    `<div class="status error">Could not load sports data</div>`;
});

}

function rendersSports(sports){

}

function loadWeather(){

  fetch(url)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  document.getElementById("target").value = data.current.temp_c;
  weatherdata = new WeatherDataObject();
  weatherdata.temperature = data.current.temp_c;
  weatherdata.windspeed = data.current.wind_mph;
  weatherdata.summary = data.current.condition.text;
  weatherdata.summarypicurl = data.current.condition.icon;
  weatherdata.feelslike = data.current.feelslike_c;
  
  // Make sure the icon URL is complete (WeatherAPI sometimes returns //cdn...)
  if (weatherdata.summarypicurl && weatherdata.summarypicurl.startsWith("//")) {
    weatherdata.summarypicurl = "https:" + weatherdata.summarypicurl;
  }

  renderWeather(weatherdata);


  console.log(weatherdata);
})
.catch(error => {
  console.error('Error:', error);
  document.getElementById("target").value = "network error";
  document.getElementById("weather-card").innerHTML =
    `<div class="status error">Could not load weather data</div>`;
});

}



// New rendering function
function renderWeather(weather) {
  const card = document.getElementById("weather-card");

  card.innerHTML = `
    <div class="card-header">
      <img src="${weather.summarypicurl}" alt="${weather.summary}">
      <div>
        <div class="temperature">${weather.temperature}°</div>
        <div class="summary">${weather.summary}</div>
      </div>
    </div>

    <div class="details">
      <div class="detail">
        <div class="detail-label">Wind</div>
        <div class="detail-value">${weather.windspeed} mph</div>
      </div>
      <!-- Easy to add more fields later -->
      <div class="detail">
        <div class="detail-label">Feels like</div>
        <div class="detail-value">${weather.feelslike}°</div>
      </div>
    </div>
  `;
}