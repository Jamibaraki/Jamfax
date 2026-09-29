const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/matches", async (req, res) => {
  const response = await fetch(
    "https://api.football-data.org/v4/teams/65/matches?status=FINISHED&limit=1",
    {
      headers: {
        "X-Auth-Token": "your_token_here"
      }
    }
  );

  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => {
  console.log("Proxy running on http://localhost:3000");
});