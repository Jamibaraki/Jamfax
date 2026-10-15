# Jamfax  

News and information sites are increasingly unreliable, messy and slow.  

The aim of this project is to create a dashboard that automatically checks various information sources and presents all the info I want in one place without ads, junk and with minimal lag.  

The goal is a compact, at-a-glance design that minimizes the need for scrolling.  

### Requirements  

Runs in the browser  
Needs API keys from supporting services  
Requires setting up a Node service  

### Architecture

Uses a Node backend to query external service APIs, then present that data via endpoints used by frontend JavaScript.  

### Setup  

Sign up and get API keys from your required services.  

Currently works with:  
weatherapi.com  
football-data.org  

Rename **config.example.js** to **config.js**  
Replace the values in **config.js**:  

Optionally set these values to 1 or 0 depending on what you want to see.  
1 = visible, 0 = invisible  
DEV_MODE: "0", //test output  
LOAD_WEATHER: "1",  
LOAD_SPORTS: "1",  

### Setting up Sports and Weather Data via Node  

You'll need to install Node which you can read about here: https://www.w3schools.com/nodejs/nodejs_get_started.asp  

You'll also need the express and cors modules installed.  You can do this with:  
  
```
npm install express cors
```

In the Node folder:  
Rename **config.example.js** to **config.js**  
Replace the values in **config.js**:  

config.team = YOUR_TEAM_ID_HERE; You'll need to get the ID for the team you're interested in from the football-data.org website. A few examples are listed below.   
config.token = YOUR_FOOTBALL_API_TOKEN_HERE;  
config.weather_api_key = your weather API key.  
config.weather_location = your latitude and longitude, eg "35.5098,139.6145" if you're at Yokohama Ramen Museum.  


A few popular team name IDs:  

* Arsenal: 57  
* Liverpool: 64  
* Manchester United: 66  


Run server.js with:  
```
node server.js  
```
The node server creates endpoints /matches  and /weather

The main.js file calls this to get the games and weather. The default URLs for the Node service are: http://localhost:3000/matches and http://localhost:3000/weather  
These are currently hardcoded in main.js as the values of sports_url and weather_node   
You'll need to change them if your Node setup uses a different location.  
You could run this on a service like Vercel, or AWS instead if you have access to those.  

### Using the actual dashboard  

Open index.html in your browser  

### Security  

This is a prototype and not suitable for production / public deployment. Values in config.js are visible to anyone viewing the site.  

### Screenshot

![Dashboard, showing loaded weather and sports fixtures.](dashboard.png)


### Windows + WSL helper (optional)

An example batch file for starting the Node proxy from Windows is in the `misc/` folder.  
Copy and edit it with your own WSL path and distro name.  
Once the proxy is running, you can usually stop it with ctrl+c  
See misc/example-jamfax-node-launcher.bat  


### Future Improvements

Caching Data  
More Services
Alternate frontend css
