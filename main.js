const key=CONFIG.WEATHER_API_KEY;
const base="https://api.weatherapi.com/v1/";
const endpoint="forecast.json?days=3&q="
const parameters=CONFIG.WEATHER_LOCATION;
const weather_url=base+endpoint+parameters+"&key="+key;

const token="0";
const sports_url="http://localhost:3000/matches";

class WeatherDataObject {
  temperature;
  windspeed;
  summary;//condition: rainy, sunny, etc
  summarypicurl;
  feelslike;
  location;
  forecast;
}

class MatchDataObject {
  id;
  date;           // formatted display date
  competition;
  homeTeam;
  awayTeam;
  homeCrest;
  awayCrest;
  status;
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

fetch(sports_url)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  const matches = (data.matches || []).map(m => {
    const match = new MatchDataObject();
    match.id          = m.id;
    match.date        = formatMatchDate(m.utcDate);
    match.competition = m.competition?.name || "";
    match.homeTeam    = m.homeTeam?.name || "TBD";
    match.awayTeam    = m.awayTeam?.name || "TBD";
    match.homeCrest   = m.homeTeam?.crest || "";
    match.awayCrest   = m.awayTeam?.crest || "";
    match.status      = m.status;
    return match;
  });

  renderSports(matches);
  //console.log(matches);
})
.catch(error => {
  console.error('Error:', error);
  document.getElementById("target").value = "network error";
  document.getElementById("sports-card").innerHTML =
    `<div class="status error">Could not load sports data</div>`;
});

}

function formatMatchDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatForecastDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00"); // avoid timezone shift
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}



function renderSports(matches){
  const card = document.getElementById("sports-card");

  if (!matches || matches.length === 0) {
    card.innerHTML = `<div class="status">No upcoming matches</div>`;
    return;
  }

  const rows = matches.map(m => `
    <div class="match-row">
      <div class="match-competition">${m.competition}</div>
      <div class="match-teams">
        <div class="team">
          ${m.homeCrest ? `<img src="${m.homeCrest}" alt="">` : ""}
          <span>${m.homeTeam}</span>
        </div>
        <div class="vs">vs</div>
        <div class="team">
          ${m.awayCrest ? `<img src="${m.awayCrest}" alt="">` : ""}
          <span>${m.awayTeam}</span>
        </div>
      </div>
      <div class="match-date">${m.date}</div>
    </div>
  `).join("");

  card.innerHTML = `
    <div class="card-title">Upcoming Matches</div>
    <div class="matches-list">
      ${rows}
    </div>
  `;

}

function loadWeather(){

  fetch(weather_url)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  //console.log(data);
  document.getElementById("target").value = data.current.temp_c;
  weatherdata = new WeatherDataObject();
  weatherdata.temperature = data.current.temp_c;
  weatherdata.windspeed = data.current.wind_mph;
  weatherdata.summary = data.current.condition.text;
  weatherdata.summarypicurl = data.current.condition.icon;
  weatherdata.feelslike = data.current.feelslike_c;
  weatherdata.location = data.location.name;
  weatherdata.forecast = data.forecast.forecastday;
  
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

  // Build the 3-day forecast rows
  const forecastRows = (weather.forecast || []).map(day => {
    let icon = day.day?.condition?.icon || "";
    if (icon.startsWith("//")) icon = "https:" + icon;

    const dateLabel = formatForecastDate(day.date);
    const condition = day.day?.condition?.text || "";
    const avg = day.day?.avgtemp_c ?? "—";
    const max = day.day?.maxtemp_c ?? "";
    const min = day.day?.mintemp_c ?? "";

    return `
      <div class="forecast-day">
        <div class="forecast-date">${dateLabel}</div>
        ${icon ? `<img src="${icon}" alt="${condition}" class="forecast-icon">` : ""}
        <div class="forecast-temps">
          <span class="forecast-avg">${avg}°</span>
          <span class="forecast-range">${min}° / ${max}°</span>
        </div>
        <div class="forecast-condition">${condition}</div>
      </div>
    `;
  }).join("");

  card.innerHTML = `
    <div class="card-title">Current ${weather.location || ""} Weather</div>

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
      <div class="detail">
        <div class="detail-label">Feels like</div>
        <div class="detail-value">${weather.feelslike}°</div>
      </div>
    </div>

    <div class="forecast-section">
      <div class="forecast-title">3-Day Forecast</div>
      <div class="forecast-list">
        ${forecastRows}
      </div>
    </div>
  `;
}