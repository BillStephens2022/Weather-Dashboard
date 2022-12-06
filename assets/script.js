// Open Weather API call parameters
const apiKey = "9c2fb74325cdd1b556e43b8c873a760b";
const unit = "imperial";

var currentDay = dayjs().format('MMMM DD, YYYY, hh:mm a');
$('#currentDay').text(currentDay);

var titleEl = $("#title");
var currentConditionsEl = $("#current-conditions");
var forecastEl = $("#forecast")

$("#citySearch").click(function(event) {
    event.preventDefault();
    var cityName = $('#cityName').val();
    console.log(cityName);
    getCurrentWeather(cityName, unit, apiKey);
    getFiveDayForecast(cityName, unit, apiKey);
  });

  function getCurrentWeather(cityName, unit, apiKey) {
    
    const requestUrlCurrentDay = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=" + unit + "&appid=" + apiKey;
    currentConditionsEl.empty();
    console.log(requestUrlCurrentDay);

    fetch(requestUrlCurrentDay)

      .then(function (response) {
        
        return response.json();
      })

      .then(function (response) {
        
        var currentTemp = response.main.temp;
        var currentWind = response.wind.speed;
        var currentHumidity = response.main.humidity;
        var currentWeatherIcon = response.weather[0].icon;
        
        var currentWeatherIconURL = "http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";
        
        currentConditionsEl.append(`
        <div class="col-md">
            <div class = "card card-current">
                <div class = "card-body">
                    <h3>${cityName}</h3>
                    <img id="weather-icon" src=${currentWeatherIconURL} alt="weather icon">
                    <p>Temp: ${currentTemp}°F</p>
                    <p>Wind: ${currentWind} MPH</p>
                    <p>Humidity: ${currentHumidity}%</p>
                </div>
            </div>
        </div>
        `);
      });
      
      
      
  }

  function getFiveDayForecast(cityName, unit, apiKey) {
    forecastEl.empty();
    const requestUrlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?lat=48.86&lon=2.35&units=" + unit + "&appid=" + apiKey;
    console.log(requestUrlFiveDay);

    fetch(requestUrlFiveDay)

      .then(function (response) {
        
        return response.json();
      })

      .then(function (response) {
        console.log(response);
        
        
        for (var i = 0; i < 40; i++) {
            console.log(response.list[i].dt_txt);
            if (response.list[i].dt_txt.includes("12:00:00")) {
                console.log("hit");    
                var forecastDate = dayjs.unix(response.list[i].dt).format('MMM D');
                var temp = response.list[i].main.temp;
                var wind = response.list[i].wind.speed;
                var humidity = response.list[i].main.humidity;
                var weatherIcon = response.list[i].weather[0].icon;
                var weatherIconURL = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
                forecastEl.append(`
                
                <div class = "card card-forecast">
                    <div class = "card-body">
                        <div class = "card-header">
                            <h3>${cityName}</h3>
                            <h4>${forecastDate}<h4>
                            <img id="weather-icon2" src=${weatherIconURL} alt="weather icon">
                        </div>
                        
                        <p>Temp: ${temp}°F</p>
                        <p>Wind: ${wind} MPH</p>
                        <p>Humidity: ${humidity}%</p>
                    </div>
                </div>           
                `);
            };
        } 
      });
  }