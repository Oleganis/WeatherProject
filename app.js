require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const _ = require('lodash')

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

let temp = "";
let query ="your city";
let weatherDescription = "";
let iconUrl;

app.get("/", function(req, res) {
  res.render("index", {
    Query: query,
    Temp: temp,
    WeatherDescription: weatherDescription,
    iconUrl: iconUrl
  });
});

app.post("/", function(req, res) {

  query = _.capitalize(req.body.cityName);
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + process.env.API_KEY + unit;

  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      temp = (weatherData.main.temp).toFixed(1);
      weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.redirect("/");
    });
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
