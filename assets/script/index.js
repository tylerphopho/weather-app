var apiKey = "32e1c02add4067945d7c6604f73cc6cd"

var queryURL="api.openweathermap.org/data/2.5/weather?q="

var searchCity = [];

var searchCities = {
    cities: []
};

var searchForecasts = {
    forcasts: []
}

$(document).ready(function() {
    var currentDate = moment().format("L")

    function getSession() {
        let cities = sessionStorage.getItem("lastOverview")
        let forecast = sessionStorage.getItem("lastForecast")
        console.log(cities)

        if(cities) {

            cities = JSON.parse(cities);
            searchedCities = cities
            if(cities.cities.length > 0) {
                renderWeather(cities.cities[0], true)
                cities.cities.forEach(function(index) {
                    renderCitiesList(index)
                })
            }
        }

        if (forecast) {
            forecast = JSON.parse(forecast);
            searchedForecasts = forecast;
            console.log(cities, forecast)
            if(forecast.forecasts.length > 0) {
                renderForecast(forecast.forecasts[0])
            }
        }

    }

    getSession()

    // AJAX call for current Weather
    function currentWeather(queryURL) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){

            searchCities.cities.push(response)

            sessionStorage.setItem("lastOverview", JSON.stringify(searchedCities));
            console.log(searchedCities)

            renderWeather(response)

            $(".list-group-item").click(function(e){
                $("#main-card").empty()
                $(".card-deck").empty()
                
                e.target

                console.log("clicked")
            });
        });
    }

    function renderWeather(response, fromStorage) {
        $("#main-card").empty()

        if(!fromStorage) {
            renderCitiesList(response)
        }

        // Create city name <h3> and append to card
        var cityTitle = $("<h3>");
        cityTitle.addClass("card-title");
        cityTitle.text(`${response.name} (${moment().format("L")})`)

        $("#main-card").append(cityTitle)

        // converts temperature to variable
        var temperature = response.main.temp //- 273.15 * 1.80 + 32;

        // Add <p> to display the temperatuer and append to city name
        var currentTemp = $("<p>");
        currentTemp.addClass("temperature");
        var t = temperature.toString()
        var temp = t.slice(0,4)
        currentTemp.html(`Temperature: ${temp} &#176; F`);
        cityTitle.append(currentTemp)
        console.log(temp)

        // Add <p> to display the humidity and apped to temperature
        var currentHumidity = $("<p>");
        currentHumidity.addClass("humidity");
        currentHumidity.html(`Humidity: ${response.main.humidity} %`);
        currentTemp.append(currentHumidity)
        console.log(response.main.humidity)

        // Add <p> to display the wind speed to humidity
        var windSpeed = $("<p>");
        windSpeed.addClass("wind-speed");
        windSpeed.html(`Wind Speed: ${response.wind.speed} MPH`);
        currentHumidity.append(windSpeed)
        console.log(response.wind.speed)

        // Add <p> to display the UV Index and append to wind speed
        var uvIndex = $("<p>");
        uvIndex.addClass("uv-index");
        uvIndex.html(`UV Index: ${response.coord.lon}`);
        windSpeed.append(uvIndex)
        console.log(response.coord)

        // Create list of searched cities

    }
    
    function renderCitiesList(response) {
        var listSection = $(".list-group");
        $("#search-form").append(listSection);

        var listItems = $(".list-group");
        listItems.addClass("list-group-item");
        listItems.text(response.name)

        listSection.prepend(listItems);
    }

    
})