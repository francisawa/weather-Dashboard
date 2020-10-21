$(window).on('load', function () {
    starterLocation();
    checkLocalStorage();
});
// API Key for all weather data 
var APIKey = "33e34e43ab7e3c39cd361d90cbc25d31";
var i = "";
var now = moment();
//Date and time formate for header
var currentDate = now.format('MMMM Do YYYY   h:mm a');
$("#currentDay").text(currentDate);

//Setting the click function at ID search button
$("#search-button").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();

    cityVal = $("#city-input").val();
    if (cityVal === '') {
        return alert('Please Enter Valid City Name ! ');
    }

    getWeather(cityVal);
    saveToLocalStorage(cityVal);
});
// Function to create Button for searched city 
function createRecentSearchBtn(city) {
    var newLi = $("<li>")
    var newBtn = $('<button>');
    //Adding Extra ID for Button to stop Creating Duplicate Button on Click
    newBtn.attr('id', 'extraBtn');
    newBtn.addClass("button is-small recentSearch");
    newBtn.text(city);
    newLi.append(newBtn)
    $("#historyList").prepend(newLi);
    //setting click function to prevent duplicate button
    $("#extraBtn").on("click", function () {
        var newY = $(this).text();
        getWeather(newY);
    });
}

//Function to get weather details 
function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    $.ajax({
        // gets the current weather info
        url: queryURL,
        method: "GET",
        error: (err => { //If API through error then alert 
            alert("City not found")
            return;
        })
    }).then(function (response) {
        console.log(response)
        //to avoid repeating city information on button click 
        $(".cityList").empty()
        $("#days").empty()
        var cityMain1 = $("<div col-12>").append($("<p><h2>" + response.name + ' (' + currentDate + ')' + "</h2><p>"));
        var image = $('<img class="imgsize">').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');        
        var degreeMain = $('<p>').text('Temperature : ' + response.main.temp + ' °F');
        var humidityMain = $('<p>').text('Humidity : ' + response.main.humidity + '%');
        var windMain = $('<p>').text('Wind Speed : ' + response.wind.speed + 'MPH');       
        var uvIndexcoord = '&lat=' + response.coord.lat + '&lon=' + response.coord.lon;
        var cityId = response.id;

        displayUVindex(uvIndexcoord);
        displayForecast(cityId);

        cityMain1.append(image).append(degreeMain).append(humidityMain).append(windMain);
        $('#cityList').empty();
        $('#cityList').append(cityMain1);
    });
}
//function for UV Index
function displayUVindex(uv) {
    $.ajax({ // gets the UV index info
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + uv,
        method: "GET"
    }).then(function (response) {
        var UVIndex = $("<p><span>");
        UVIndex.addClass("badge");
        UVIndex.text(response.value);
        if(response.value < 4){
            UVIndex.addClass("badge-success")
        } else if (response.value < 7){
            UVIndex.addClass("badge-warning")
        } else {
            UVIndex.addClass("badge-danger")
        }
        $("#cityList").append('UV-Index : ').append(UVIndex);       
    });
}
//function to Display 5 Day forecast
function displayForecast(city) {
    $.ajax({ // gets the 5 day forecast API
        url: "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&units=imperial&APPID=" + APIKey,
        method: "GET",
    }).then(function (response) {
        console.log(response)
        //  Parse response to display forecast for next 5 days underneath current conditions
        var resList = response.list;
        for (var i = 0; i < resList.length; i=i+8) {
                //console.log(resList[i]);

                var cityMain = $('<div>');
                cityMain.addClass('col forecast bg-primary text-white ml-3 mb-3 rounded>');
                var date5 = $("<h5>").text(response.list[i].dt_txt.split(" ")[0]);
                var image = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + resList[i].weather[0].icon + '.png');
                var degreeMain = $('<p>').text('Temp : ' + resList[i].main.temp + ' °F');               
                var humidityMain = $('<p>').text('Humidity : ' + resList[i].main.humidity + '%');
                var windMain = $('<p>').text('Wind Speed : ' + resList[i].wind.speed + 'MPH');    

                cityMain.append(date5).append(image).append(degreeMain).append(humidityMain).append(windMain);
                
                $('#days').append(cityMain);
        }
    });
};
// Display automatic Current Locaion 
function starterLocation() {
    var storedCities = JSON.parse(localStorage.getItem('cities')) || []
    if(storedCities.length > 0){
        getWeather(storedCities[0])
    } else {
        //Default
        getWeather("Seattle")
    }
};

// Function to get data store in Locaal Storage 
function checkLocalStorage() {
    var storedCities = JSON.parse(localStorage.getItem('cities')) || []
    for(var i = 0; i < storedCities.length; i++){
        createRecentSearchBtn(storedCities[i])
    }
};
// Function to Set data in Local storage
function saveToLocalStorage(city) {
    var storedCities = JSON.parse(localStorage.getItem('cities')) || []
    if(storedCities.indexOf(city) === -1){
        storedCities.push(city)
    }
    localStorage.setItem("cities", JSON.stringify(storedCities))
}
//added clear histor fuction to clear searched city list
$("#clear-history").on("click", function (event) {
    $("#historyList").empty();
    localStorage.clear()
});



















