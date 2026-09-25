const key=CONFIG.WEATHER_API_KEY;
const base="https://api.weatherapi.com/v1/";
const endpoint="current.json?q="
const parameters=CONFIG.WEATHER_LOCATION;
const url=base+endpoint+parameters+"&key="+key;

class WeatherDataObject {
  temperature;
  windspeed;
  summary;//condition: rainy, sunny, etc
  summarypicurl;
}
  
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
  console.log(data);
})
.catch(error => {
  console.error('Error:', error);
  document.getElementById("target").value = "network error";
});