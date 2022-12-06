// Open Weather API call parameters
const apiKey = "9c2fb74325cdd1b556e43b8c873a760b";
const unit = "imperial";



var currentDay = dayjs().format('MMMM DD, YYYY');
$('#currentDay').text(currentDay);



var titleEl = $("#title");
var cityEl = document.createElement('h3');
var currentWeatherIconEl = document.createElement('img');
var currentTempEl = document.createElement('p');
var currentHumidityEl = document.createElement('p');
var currentWindEl = document.createElement('p');
var currentHumidityEl = document.createElement('p');



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
        
        var currentTemp = response.main.temp;
        var currentWind = response.wind.speed;
        var currentHumidity = response.main.humidity;
        var currentWeatherIcon = response.weather[0].icon;
        
        var currentWeatherIconURL = "http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";
        
        titleEl.append(`
        <div class="col-md">
            <div class = card text-white bg-primary">
                <div class = "card-body">
                    <h3>${cityName}</h3>
                    <h4>${currentDay}
                    <img src=${currentWeatherIconURL} alt="weather icon">
                    <p>Temp: ${currentTemp}°F</p>
                    <p>Wind: ${currentWind}</p>
                    <p>Humidity: ${currentHumidity}%</p>
                </div>
            </div>
        </div>
        `);
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