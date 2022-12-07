// Open Weather API call parameters
const apiKey = "9c2fb74325cdd1b556e43b8c873a760b";
const unit = "imperial";

// Pulls current Day from dateJS and places it into an HTML element
var currentDay = dayjs().format('MMMM DD, YYYY, hh:mm a');
$('#currentDay').text(currentDay);

// declare vairables for certain HTML elements
var titleEl = $("#title");
var currentConditionsEl = $("#current-conditions");
var forecastEl = $("#forecast");
var responseTextEl = $("<h4>");
var buttonsEl = ("#buttons");

/* declare variable for cities array which will be saved to local storage and rendered into buttons so the user
can easily pull up weather conditions for their favorite cities.  */

var cities = getLocalStorage();
var storedCities = JSON.parse(localStorage.getItem("cities"));

createButtons();

//Clicking on the search button will trigger pull to the Open Weather API to get both current weather and forecast
$("#citySearch").click(function(event) {
    event.preventDefault();
    var cityName = $('#cityName').val().trim();
    if (!cities.includes(cityName)) {
      cities.push(cityName);
      if (cities.length > 5) {
        cities.shift();
      };
    };
    cities.push[cityName];
    localStorage.setItem("cities", JSON.stringify(cities));
    storedCities = JSON.parse(localStorage.getItem("cities"));
    getCoordinates(cityName);
  });

  // function to retrieve saved searches from local storage

  function getLocalStorage() {
    return JSON.parse(localStorage.getItem("cities")) || [];
  };

  // function to render buttons as user adds new cities
  function createButtons() {
    $('#buttons').empty();
    if (storedCities !== null) {
      for (var i = 0; i < storedCities.length; i++) {
        var cityButton = $("<button>");
        cityButton.addClass("btn city-btn");
        cityButton.text(storedCities[i]);
        $('#buttons').append(cityButton);
      };
    } else {
        return;
    };
  }
  

  // function to handle clicks on each of the cities' rendered buttons
  
  $(buttonsEl).on('click', function(event) {
    event.preventDefault();
    var cityButtonPressed = event.target.textContent;
    getCoordinates(cityButtonPressed);
  });

  //function to convert city names to coordinates using OpenWeather API

  function getCoordinates(cityName) {
    const requestUrlCoordinates = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey;
    
    fetch(requestUrlCoordinates)
      /* if error with response, HTML message is rendered for the user to enter a valid city name. the invalid entry is removed from the cities 
      arrays so that a button won't get rendered and won't get saved in local storage. If no error, data is returned and any error messages are cleared 
      from the HTML. */

      .then(function (response) {
        if (response.status !== 200) {
          $('.response').append(responseTextEl);
          responseTextEl.text("Input Error!  Please enter a valid city");
          cities.pop();
          storedCities.pop();
          createButtons();
        } else {
          responseTextEl.empty();
          };
          return response.json();
        }
      )
      /* After data received, the latitude and longitude are saved into variables and the "getCurrentWeather" and "getFiveDayForecast" 
      functions are called using the coordinates received as well as the other parameters needed for the API calls.  If invalid city is entered
      the API call still receives an empty array - if this happens, an error message is displayed for the user to add a valid city. */
        .then(function (data) {
          if(data.length !== 0) {
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            getCurrentWeather(latitude, longitude, unit, apiKey, cityName);
            getFiveDayForecast(latitude, longitude, unit, apiKey, cityName);
          } else {
            $('.response').append(responseTextEl);
            responseTextEl.text("Input Error!  Please enter a valid city");
            cities.pop();
            storedCities.pop();
            createButtons();
          };
        });
  }

  /* function to fetch current weather data from the Open Weather API. Error handling will render a message 
  (which will blink via CSS). Error message will be removed once a valid city is entered.  Once valid city is 
  entered, error message will be removed, and HTML will be rendered to show the current weather conditions 
  for that city.  If valid city is entered, HTML will be rendered for a card showing the current conditions. */

  function getCurrentWeather(latitude, longitude, unit, apiKey, cityName) {
    const requestUrlCurrentDay = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=" + unit + "&appid=" + apiKey;
    currentConditionsEl.empty();
    fetch(requestUrlCurrentDay)
      .then(function (response) {
        if (response.status !== 200) {
          $('.response').append(responseTextEl);
          responseTextEl.text("Input Error!  Please enter a valid city");
          cities.pop();
          storedCities.pop();
          createButtons();
        } else {
          responseTextEl.empty();
          };
          return response.json();
        }
      )
      .then(function (data) {
          createButtons();
          if(data) {
          var currentTemp = data.main.temp;
          var currentWind = data.wind.speed;
          var currentHumidity = data.main.humidity;
          var currentWeatherIcon = data.weather[0].icon;
          var currentWeatherIconURL = "https://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";
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
        }
      });
  }

  /* function to fetch data from the Open Weather API. This pulls 16 day forecast, and for loop will render HTML to
  to show a card for each day. */

  function getFiveDayForecast(latitude, longitude, unit, apiKey, cityName) {
    forecastEl.empty();
    const requestUrlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=" + unit + "&appid=" + apiKey;
    

    fetch(requestUrlFiveDay)

      .then(function (response) {
        
        return response.json();
      })

      .then(function (response) {
        
      /* Since it shows the weather forecast for every 3 hours, the if statement will 
      ensure that only data points at 18:00:00 GMT (13:00:00 / 1PM Eastern Standard Time) are picked up each day.  
      Index goes to 40 on the for loop since there are 8 3-hour periods per day x 5 days = 40. */
      
        for (var i = 0; i < 40; i++) {
            
            if (response.list[i].dt_txt.includes("18:00:00")) {
              
                var forecastDate = dayjs.unix(response.list[i].dt).format('MMM D');
                var temp = response.list[i].main.temp;
                var wind = response.list[i].wind.speed;
                var humidity = response.list[i].main.humidity;
                var weatherIcon = response.list[i].weather[0].icon;
                var weatherIconURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
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
  