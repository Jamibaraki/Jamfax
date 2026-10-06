const express = require("express");
const cors = require("cors");

var config = require('./config');

const url_base="https://api.football-data.org/v4/";
const team = config.team;
const endpoint="teams/"+team+"/matches?status=SCHEDULED&limit=5";
const app = express();

app.use(cors());

app.get("/matches", async (req, res) => {
  const response = await fetch(
    url_base+endpoint,
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