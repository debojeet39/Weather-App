const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const useContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const API_KEY ="d1845658f92b31c64bd94f06f7188c9c"; 

let currentTab = userTab;

//Setting Current tab as  Defalut Setting
currentTab.classList.add("current-tab");

getfromSessionStorage();
//Switching Tab Function

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

       if(!searchForm.classList.contains("active")){
userInfoContainer.classList.remove("active");
grantAccessContainer.classList.remove("active");
searchForm.classList.add("active");
       }
    
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");

        //search weather tab here lets check local storage first if it contains coordinates
            getfromSessionStorage();

    }
  }
}

//Switching Tab

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});


//checks if coordinates are present in session
function getfromSessionStorage(){
const localCoordinates = sessionStorage.getItem("user-coordinates");

if(!localCoordinates){
grantAccessContainer.classList.add("active");
}
//Else case where Local coordinate is present
else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
}
}

//Function for fetchuserinfo to fetch the lat and lon data using api
//In case of API Call Always use Async !!!!!

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;

    //Make grant container invisible 
grantAccessContainer.classList.remove("active");
    //make loading screen visible
loadingScreen.classList.add("active");


    // Now Using API To Call get the lat and lon data

    try{
const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    
);

const data = await response.json();
loadingScreen.classList.remove("active");
userInfoContainer.classList.add("active");

//Writing A Function to render the dynamically render the values to the UI
renderWeatherInfo(data);
    }
    catch(err){
    loadingScreen.classList.remove("active");
    }

}

function renderWeatherInfo(weatherInfo){
    // Firstly we have to Fetch the element
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-weatherTemp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness =document.querySelector("[data-cloudiness]");

    //fetching elements and putting the data 

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C `;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}% `;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}% `;


}

//Creating Get Location function

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        //Showing An Alert
alert("Location Access Denied Or Blocked");
    }
}


//Now Writing Show Postion Function

function showPosition(Postion){
const  userCoordinates = {
    lat: Postion.coords.latitude,
    lon: Postion.coords.longitude,
}

//Now Creating Session Storage For Preloaded Location Storage

sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
fetchUserWeatherInfo(userCoordinates);
}





const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getLocation);



// Fetching value from SearchForm

const searchInput = document.querySelector("[data-SearchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName==="")
    return;
else{
    fetchSearchWeatherInfo(cityName);
}
})

//Now Creating a Function Same as Before to Fetch Ciity Data Using Api !! Using Async Function Again

async function fetchSearchWeatherInfo(city){
loadingScreen.classList.add("active");
userInfoContainer.classList.remove("active");
grantAccessContainer.classList.remove("active");

//Calling The Api

try{
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}
catch(err){

}

}
