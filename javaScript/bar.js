document.addEventListener("DOMContentLoaded", async function () {
    // ...existing code...
 
    const apiKey = "cb321f672123429ebc5155027250208";
    const cityInput = document.querySelector(".search-bar");
    
    
    const favCities = [];
    let favCity = "";

        // Function to change background based on weather conditions
    const backgroundChange = (isDay, skyCondition) => {
        if (isDay) {
            if (skyCondition.toLowerCase() == "sunny" || skyCondition.toLowerCase() == "clear") {
                document.querySelector(".background").style.background = "url('images/sunny-sky.jpg')";
            } else if (skyCondition.toLowerCase() == "partly cloudy") {
                document.querySelector(".background").style.backgroundImage = "url('images/partly-cloudy-sky.jpg')";
            } else if (skyCondition.toLowerCase() == "cloudy") {
                document.querySelector(".background").style.backgroundImage = "url('images/dark-cloudy-sky.jpg')";
            } else if (skyCondition.toLowerCase() == "rainy" || skyCondition.toLowerCase() == "light rain" || skyCondition.toLowerCase() == "heavy rain") {
                document.querySelector(".background").style.backgroundImage = "url('images/rainy-sky.jpg')";
            } else if (skyCondition.toLowerCase() == "snowy") {
                document.querySelector(".background").style.backgroundImage = "url('images/snowy-sky.jpeg')";
            } else {
                document.querySelector(".background").style.backgroundImage = "url('images/average-sky.jpg')";
            }

        } else if (!isDay) {
            document.querySelector(".background").style.backgroundImage = "url('images/night-sky.jpg')";
            document.querySelector(".current-weather").style.color = "#ffffff";
        }
        document.querySelector(".background").style.backgroundSize = "1700px";
    }


    let celcius = true;
    document.getElementById("choose-celcius").addEventListener("click", async event => {
        celcius = true;
    });
    
    document.getElementById("choose-fahrenheit").addEventListener("click", async event => {
        celcius = false;
    });
    


        // Function to save location as favourite
        const saveLocation = async () => {
            event.preventDefault();
            const saveBtn = document.getElementById("save-location-btn");
            const favIcon = document.getElementById("fav-icon");
            favCity = favCity.toLowerCase();
            favCity = favCity.charAt(0).toUpperCase() + favCity.slice(1);
            if (!favCities.includes(favCity)) {
                favCities.push(favCity);
                console.log(`Saving ${favCity} as favourite`);
                const favItem = document.createElement("div");
                favItem.classList.add("fav-item");
                favItem.innerHTML = `
                    <a href="#" class="fav-city" id="fav-city-${favCities.length}">${favCity}</a>
                `;
                document.querySelector(".fav-list").removeChild(document.querySelector(".fav-footer"));
                document.querySelector(".fav-list").appendChild(favItem);
                document.querySelector(".fav-list").appendChild(document.createElement("div")).classList.add("fav-footer");
                console.log(favCities);
                saveBtn.classList.remove("save-fav-button");
                saveBtn.classList.add("fav-closed-button");
                favIcon.src = "images/icons-star-filled.png";
            } else {
                console.log(`Stop! ${favCity} is already in the favourites list`);
            }
        }

            
        // Functions used for updating UI and background
        const mainSectionUpdate = (weatherdata) => {
            if (celcius) {
                document.querySelector(".temp-main").textContent = `${parseInt(weatherdata.current.temp_c)}°C`;
                document.querySelector("#feels-like").textContent = parseInt(weatherdata.current.feelslike_c) + "°C";

            } else {
                document.querySelector(".temp-main").textContent = `${parseInt(weatherdata.current.temp_f)}°F`;
                document.querySelector("#feels-like").textContent = parseInt(weatherdata.current.feelslike_f) + "°F";

            }
            document.querySelector(".city-name").textContent = weatherdata.location.name;
            document.querySelector(".temp-info").textContent = weatherdata.current.condition.text;
            document.querySelector(".current-time").textContent = new Date(weatherdata.location.localtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            document.querySelector(".current-day").textContent = new Date(weatherdata.location.localtime).toLocaleDateString([], { weekday: 'long' });
            document.querySelector(".weather-icon").src = weatherdata.current.condition.icon;
            document.querySelector("#humidity").textContent = parseInt(weatherdata.current.humidity) + "%";
            document.querySelector("#wind-speed").textContent = parseInt(weatherdata.current.wind_kph) + "Km/h";
            document.querySelector("#uv-index").textContent = weatherdata.current.uv;
            document.querySelector("#rain-chance").textContent = weatherdata.forecast.forecastday[0].day.daily_chance_of_rain + "%";
            document.querySelector("#snow-chance").textContent = weatherdata.forecast.forecastday[0].day.daily_chance_of_snow + "%";
            document.querySelector("#visibility").textContent = weatherdata.current.vis_km + "km";
            document.querySelector("#aq-index").textContent = weatherdata.current.air_quality["us-epa-index"];
            document.querySelector("#sunrise").textContent = weatherdata.forecast.forecastday[0].astro.sunrise;
            document.querySelector("#sunset").textContent = weatherdata.forecast.forecastday[0].astro.sunset;

        }

        // function to show hourly forecast
        const hourlyUpdate = (weatherdata) => {
            const hourlySection = document.querySelector(".hourly-forecast");
            hourlySection.innerHTML = ""; // Clear previous data

            // Took the help of Chatgpt 4.1 to resolve this part for errors
            const allHours = weatherdata.forecast.forecastday.flatMap(day => day.hour);
            const currentTime = new Date(weatherdata.location.localtime);
            const currentHour = currentTime.getHours();
            let startIdx = allHours.findIndex(h => {
                const hTime = new Date(h.time);
                return hTime > currentTime;
            });
            if (startIdx === -1) startIdx = 0; // fallback if not found
            // Until here

            for (let i = startIdx; i < Math.min(startIdx + 24, allHours.length); i++) {
                const hour = allHours[i];
                const hourItem = document.createElement("div");
                hourItem.classList.add("hour-group-item");
                let timeStr = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                if (timeStr == "24:00") {
                    timeStr = "00:00";
                }
                let tempM = hour.temp_c; 
                if (!celcius) {
                    tempM = (hour.temp_f)
                }
                hourItem.innerHTML = `
                    <div class="hour-time">
                        <h6 class="mb-0">${timeStr}</h6>
                    </div>
                    <div class="temp-hour">
                        <h2 class="max-hour-temp">${Math.round(tempM)}°${celcius ? 'C' : 'F'}</h2>
                    </div>
                    <div class="weather-hour">
                        <img class="hour-weather-icon" src="${hour.condition.icon}" alt="icon">
                        <h5><img src="images/icon-droplet.png" width="18" alt="">${hour.chance_of_rain}%</h5>
                    </div>

                `;
                hourlySection.appendChild(hourItem);
            }
        }



        function sideScroll(element,direction,speed,distance,step) {
            let scrollAmount = 0;
            let slideTimer = setInterval(function(){
                if(direction == 'left'){
                    element.scrollLeft -= step;
                } else {
                    element.scrollLeft += step;
                }
                scrollAmount += step;
                if(scrollAmount >= distance){
                    window.clearInterval(slideTimer);
                }
            }, speed);
        }

        document.getElementById("left-arrow").addEventListener("click", function() {
            const hourlySection = document.querySelector(".hourly-forecast");
            sideScroll(hourlySection, 'left', 10, 400, 20);
        });

        document.getElementById("right-arrow").addEventListener("click", function() {
            const hourlySection = document.querySelector(".hourly-forecast");
            sideScroll(hourlySection, 'right', 10, 400, 20);
        });

        // Function to show weekly forecast
        const weeklyUpdate = (weatherdata) => {
            const weeklySection = document.querySelector(".weekly-forecast");
            weeklySection.innerHTML = ""; // Clear previous data

            const today = new Date();
            today.setHours(0,0,0,0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            weatherdata.forecast.forecastday.forEach(day => {
                const dayItem = document.createElement("div");
                dayItem.classList.add("list-group-item");
                const dayDate = new Date(day.date);
                dayDate.setHours(0,0,0,0);
                let dayStr;
                if (dayDate.getTime() == today.getTime()) {
                    return; // Skip adding "Today" to the weekly forecast
                } else if (dayDate.getTime() == tomorrow.getTime()) {
                    dayStr = "Tomorrow";
                } else {
                    dayStr = dayDate.toLocaleDateString([], { weekday: 'long' });
                }
                let dateStr1 = dayDate.toLocaleDateString([], { day: '2-digit' });
                let dateStr2 = dayDate.toLocaleDateString([], { month: '2-digit' });
                let maxTemp = Math.round(day.day.maxtemp_c);
                let minTemp = Math.round(day.day.mintemp_c);
                if (!celcius) {
                    maxTemp = Math.round(day.day.maxtemp_f);
                    minTemp = Math.round(day.day.mintemp_f);
                }
                dayItem.innerHTML = `
                    <div class="week-day-name">
                        <h6 class="mb-0">${dayStr}</h6>
                        <small class="mb-0">${dateStr1}/${dateStr2}</small>
                    </div>
                    <div class="day-weather-icon">
                        <img src="${day.day.condition.icon}" alt="icon" class="day-weather-icon">
                    </div>
                    <div class="temp-day">
                        <h2 class="max-day-temp">${maxTemp}°${celcius ? 'C' : 'F'}</h2>
                        <h2 class="min-day-temp">${minTemp}°${celcius ? 'C' : 'F'}</h2>
                    </div>
                    <div class="weather-day-type">
                        <h5>${day.day.condition.text}</h5>
                    </div>
                    <h5 class="rain-chance-day"><img src="images/icon-droplet.png" width="18" alt="">${day.day.daily_chance_of_rain}%</h5>
                `;
                weeklySection.appendChild(dayItem);
            });
        }

            //adding city to favourites
        document.getElementById("save-location-btn").addEventListener("click", saveLocation);    
        

        // Function to handle clicks on favourite cities
        document.querySelector(".fav-list").addEventListener("click", async function(e) {
            const target = e.target;
            if (target.classList.contains("fav-city")) {
                e.preventDefault();
                const city = target.textContent;
                const cityWeatherData = await fetchWeatherData(city);
                if (cityWeatherData) {
                    mainSectionUpdate(cityWeatherData);
                    backgroundChange(cityWeatherData.current.is_day, cityWeatherData.current.condition.text);
                    hourlyUpdate(cityWeatherData);
                    weeklyUpdate(cityWeatherData);
                }
            }
        });

        // constructor for fetching weather data
        async function fetchWeatherData(cityName) {
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=8&aqi=yes&alerts=no`;
            const resp = await fetch(url);
            if (!resp.ok) {
                alert(`Could not find the city`);
            }
            return await resp.json();
        }

        // Fetch data for the current location
        const getCurrentLocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationWeatherData = await fetchWeatherData(`${latitude},${longitude}`);
                    console.log(locationWeatherData);
                    if (locationWeatherData) {
                        favCity = locationWeatherData.location.name;
                        mainSectionUpdate(locationWeatherData);
                        backgroundChange(locationWeatherData.current.is_day, locationWeatherData.current.condition.text);
                        hourlyUpdate(locationWeatherData);
                        weeklyUpdate(locationWeatherData);
                    }
                });

            }
        };

        // Click on Choose current location button to fetch current location weather
        document.getElementById("location-button").addEventListener("click", async event => {
            event.preventDefault();
            getCurrentLocation();

            // Make the main body visible and remove the initial welcome texts
            if (document.getElementById("welcome-body")) {
                document.getElementById("main-body").style.visibility = "visible";
                document.getElementById("welcome-body").remove();
            }
        });


            // Fetch data for input search city
        document.getElementById("search-button").addEventListener("click", async event => {
            event.preventDefault();
            const city = cityInput.value;
            favCity = city;
            console.log(`Searching for weather in ${city}`);
            const inputWeatherData = await fetchWeatherData(city);
            console.log(inputWeatherData);
            if (inputWeatherData) {
                const saveBtn = document.getElementById("save-location-btn");
                const favIcon = document.getElementById("fav-icon");
                if (favCities.includes(favCity)) {
                    saveBtn.classList.remove("save-fav-button");
                    saveBtn.classList.add("fav-closed-button");
                    favIcon.src = "images/icons-star-filled.png";
                } else {
                    saveBtn.classList.remove("fav-closed-button");
                    saveBtn.classList.add("save-fav-button");
                }
                mainSectionUpdate(inputWeatherData);
                backgroundChange(inputWeatherData.current.is_day, inputWeatherData.current.condition.text);
                hourlyUpdate(inputWeatherData); 
                weeklyUpdate(inputWeatherData);   
            }
            // clear the search bar
            document.getElementById("search-bar").value = "";

            // Make the main body visible and remove the initial welcome texts
            if (document.getElementById("welcome-body")) {
                document.getElementById("main-body").style.visibility = "visible";
                document.getElementById("welcome-body").remove();
            }
        });


});
    
