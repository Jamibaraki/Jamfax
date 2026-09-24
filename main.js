const key=CONFIG.WEATHER_API_KEY;
const base="https://api.weatherapi.com/v1/";
const endpoint="current.json?q="
const parameters=CONFIG.WEATHER_LOCATION;
url=base+endpoint+parameters+"&key="+key;
  
fetch(url)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  document.getElementById("target").value = data.current.temp_c;
  console.log(data);
})
.catch(error => {
  console.error('Error:', error);
});