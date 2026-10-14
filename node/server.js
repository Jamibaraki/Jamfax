const express = require("express");
const cors = require("cors");

var config = require('./config');

//weather call
const key=config.weather_api_key;
const base="https://api.weatherapi.com/v1/";
const weather_endpoint="forecast.json?days=3&q="
const parameters=config.weather_location;
const weather_url=base+weather_endpoint+parameters+"&key="+key;

//sports call
const sports_url_base="https://api.football-data.org/v4/";
const team = config.team;
const endpoint="teams/"+team+"/matches?status=SCHEDULED&limit=5";
const app = express();

app.use(cors());

app.get("/weather", async (req, res) => {
  const response = await fetch(
    weather_url,

  );

  const data = await response.json();
  res.json(data);
});



app.get("/matches", async (req, res) => {
  const response = await fetch(
    sports_url_base+endpoint,
    {
      headers: {
        "X-Auth-Token": config.token
      }
    }
  );

  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => {
  console.log("Proxy running on http://localhost:3000");
});