const express = require("express");
const cors = require("cors");

//caching
const fs = require("fs");
const path = require("path");
const MATCHES_CACHE_FILE = path.join(__dirname, "matches-cache.json");

//config
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

function readMatchesCache() {
  try {
    if (!fs.existsSync(MATCHES_CACHE_FILE)) return null;
    const raw = fs.readFileSync(MATCHES_CACHE_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Could not read matches cache:", err.message);
    return null;
  }
}

function writeMatchesCache(apiData) {
  try {
    const payload = {
      savedAt: new Date().toISOString(),
      data: apiData
    };
    fs.writeFileSync(MATCHES_CACHE_FILE, JSON.stringify(payload, null, 2), "utf8");
  } catch (err) {
    console.error("Could not write matches cache:", err.message);
  }
}

function isMatchesCacheValid(cache) {
  if (!cache || !cache.data) return false;

  const matches = cache.data.matches || [];
  if (matches.length === 0) return false; // nothing scheduled, so refetch

  // Earliest upcoming match time
  const timestamps = matches
    .map(m => m.utcDate)
    .filter(Boolean)
    .map(d => new Date(d).getTime())
    .filter(t => !Number.isNaN(t));

  if (timestamps.length === 0) return false;

  const earliest = Math.min(...timestamps);
  const now = Date.now();

  // Cache is valid until the earliest match starts
  return now < earliest;
}



app.use(cors());

app.get("/weather", async (req, res) => {
  const response = await fetch(
    weather_url,

  );

  const data = await response.json();
  res.json(data);
});



app.get("/matches", async (req, res) => {
  try {
    const cache = readMatchesCache();

    if (isMatchesCacheValid(cache)) {
      console.log("Serving matches from cache");
      return res.json(cache.data);
    }

    console.log("Fetching fresh matches from API");
    const response = await fetch(sports_url_base + endpoint, {
      headers: {
        "X-Auth-Token": config.token
      }
    });

    if (!response.ok) {
      throw new Error(`Football API error: ${response.status}`);
    }

    const data = await response.json();
    writeMatchesCache(data);
    res.json(data);
  } catch (err) {
    console.error("Matches error:", err.message);

    // Optional: fall back to stale cache if live fetch fails
    const cache = readMatchesCache();
    if (cache?.data) {
      console.log("Serving stale matches cache after error");
      return res.json(cache.data);
    }

    res.status(500).json({ error: "Could not load matches" });
  }
});

app.listen(3000, () => {
  console.log("Proxy running on http://localhost:3000");
});