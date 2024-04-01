// Function to format date according to display requirement
let formatDateTime = (unixTimeStamp) => {
  let timestamp = new Date(unixTimeStamp * 1000);
  const timeZone = "Asia/Kolkata";
  let format = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
  let formatted = format.formatToParts(timestamp).map((part) => part.value);
  let finalVal = {
    time: `${formatted[6]} ${formatted[7]} ${formatted[8]} ${formatted[10]}`,
    date: `${formatted[2]} ${formatted[0]} ${formatted[4]}`,
  };
  return finalVal;
};

// Function to convert an string into camelcase
let toCamelCase = (inputString) => {
  return inputString.replace(/\b[a-z]/g, (match) => {
    return match.toUpperCase();
  });
};

// API call to fetch weather data from openweatherapi return is json format
let response = async (searchQuery, userLocation = false) => {
  let url;
  if (!userLocation) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=91bc80328511a5d8398bba30e3ea53d1&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.lat}&lon=${userLocation.long}&appid=91bc80328511a5d8398bba30e3ea53d1&units=metric`;
  }
  let result = await fetch(url);
  return result.json();
};

// Update required data into dom
let updateData = (response) => {
  document.getElementById("temp").innerHTML = response.main.temp;
  document.getElementById("city").innerHTML = response.name;
  let timestamp = formatDateTime(response.dt);
  document.getElementById("time").innerHTML = timestamp.time;
  // console.log(timestamp.date);
  document.getElementById("weather-desc").innerText = toCamelCase(
    response.weather[0].description
  );
  // console.log(response.weather[0].description);
  document.getElementById(
    "descicon"
  ).src = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
  document.getElementById("feel-like").innerText = response.main.feels_like;
  document.getElementById("temp-min").innerText = response.main.temp_min;
  document.getElementById("temp-max").innerText = response.main.temp_max;
  document.getElementById("sunrise").innerText = formatDateTime(
    response.sys.sunrise
  ).time;
  document.getElementById("sunset").innerText = formatDateTime(
    response.sys.sunset
  ).time;
  document.getElementById("windSpeed").innerText = response.wind.speed;
  document.getElementById("vis-value").innerText = response.visibility / 1000;
  document.getElementById("humidity").innerText = response.main.humidity;
};

// If location given by user in searchbox
document.getElementById("searchbar").addEventListener("submit", (event) => {
  event.preventDefault();
  const searchQuery = document.getElementsByName("searchText")[0].value;
  mannualLocation(searchQuery);
});

var userCoordinates = { long: -74.006, lat: 40.7143 }; //Global variable to store location of address being displayed

// Access to user location granted
const userLocation = async (location) => {
  userCoordinates.lat = location.coords.latitude;
  userCoordinates.long = location.coords.longitude;
  let result = await response(searchQuery, userCoordinates);
  updateData(result);
};

// Access to user location not granted
const mannualLocation = async (searchQuery = "New York") => {
  let result = await response(searchQuery);
  // console.log(result);
  updateData(result);
};

// Fetch user location first parameter is for if access granted and second if not (callbacks)
navigator.geolocation.getCurrentPosition(userLocation, mannualLocation);

// callback func to provide parameters and element to bings api
function GetMap() {
  var map = new Microsoft.Maps.Map("#map", {
    credentials:
      "Atm3FL7yEPbwHzwydCKc6x5S4co2frvIfXkwyv3KGqdUvBRCY9fhRvqVfvZCUsVe",
    center: new Microsoft.Maps.Location(userCoordinates.lat, userCoordinates.long),
    // mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    zoom: 13,
  });
  var center = map.getCenter();

  var pin = new Microsoft.Maps.Pushpin(center, {
    // // title: 'Here',
    text: '1',
    // icon: "../assets/media/locator.png",
    // anchor: new Microsoft.Maps.Point(12, 39),
  });

  map.entities.push(pin);
}

mannualLocation();

