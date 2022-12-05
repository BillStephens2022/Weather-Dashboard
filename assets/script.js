// Open Weather API call parameters
const apiKey = "9c2fb74325cdd1b556e43b8c873a760b";
const unit = "imperial";



var currentDay = dayjs().format('MMMM DD, YYYY');
$('#currentDay').text(currentDay);



var titleEl = $("#title");
var cityEl = document.createElement('h3');
var currentTempEl = document.createElement('p');
var currentHumidityEl = document.createElement('p');
var currentWindEl = document.createElement('p');
var currentHumidityEl = document.createElement('p');
var currentWeatherIconEl = document.createElement('img');


$("#citySearch").click(function(event) {
    event.preventDefault();
    var cityName = $('#cityName').val();
    console.log(cityName);
    getCurrentWeather(cityName, unit, apiKey);
    getFiveDayForecast(cityName, unit, apiKey);
  });

  function getCurrentWeather(cityName, unit, apiKey) {
    
    const requestUrlCurrentDay = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=" + unit + "&appid=" + apiKey;
    console.log(requestUrlCurrentDay);

    fetch(requestUrlCurrentDay)

      .then(function (response) {
        
        return response.json();
      })

      .then(function (response) {
        console.log(response);
        var currentTemp = response.main.temp;
        var currentWind = response.wind.speed;
        var currentHumidity = response.main.humidity;
        var currentWeatherIcon = response.weather[0].icon;
        var currentWeatherIconURL = "http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";
        console.log(currentWeatherIconURL);
        titleEl.append(cityEl);
        titleEl.append(currentTempEl);
        titleEl.append(currentWindEl);
        titleEl.append(currentHumidityEl);
        cityEl.textContent = cityName;
        currentWeatherIconEl.src = currentWeatherIconURL;
        currentTempEl.textContent = `Temp: ${currentTemp}°F`;
        currentHumidityEl.textContent = `Humidity: ${currentHumidity}%`;
        currentWindEl.textContent = `Wind: ${currentWind} MPH`;
      });
      
      
      
  }

  function getFiveDayForecast(cityName, unit, apiKey) {
    
    const requestUrlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99" + "&units" + unit + "&appid=" + apiKey;
    console.log(requestUrlFiveDay);

    fetch(requestUrlFiveDay)

      .then(function (response) {
        
        return response.json();
      })

      .then(function (data) {
        console.log(data);
      });
  }