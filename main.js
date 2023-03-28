const cityInput = document.getElementById("city");
const citySubmit = document.getElementById("citySubmit");
let now = moment();
let ourTimeZone = now.utcOffset() / 60;

let cityName;

//variables for api call
let tempValue;
let feelsValue;
let windValue;
let windDirValue;
let humidityValue;
let visibilityValue;
let pressureValue;
let sunriseUnix;
let sunsetUnix;
let skyValue;

//variables for capybara statements
let capybaraFeeling;
let whatToWear;
var saying;

var capybaraImg = document.getElementById("capybaraImg");
var weatherIconImg = document.getElementById("weatherIcon");

citySubmit.onclick = function(){
    weatherCall();
}

//hitting enter or return on keyboard also calls the weather api
cityInput.addEventListener("keypress", function(e) {
    if(e.keyCode == 13){
        weatherCall();
    }
});

function weatherCall(){

    cityName = cityInput.value;
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

    //fetch the api
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+cityName+',US,+1&units=imperial&appid=213fad57b4dbe970269b447894c21bfb')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        //grab all the data from the api and set it to variables
        tempValue = data['main']['temp'];
        tempValue = parseFloat(tempValue).toFixed(0);
        feelsValue = data['main']['feels_like'];
        feelsValue = parseFloat(feelsValue).toFixed(0);
        windValue = data['wind']['speed'];
        windValue = parseFloat(windValue).toFixed(0);
        windDirValue = data['wind']['deg'];
        humidityValue = data['main']['humidity']
        visibilityValue = data['visibility']
        visibilityValue /= 1000;
        visibilityValue = parseFloat(visibilityValue).toFixed(1);
        pressureValue = data['main']['pressure']
        pressureValue *= 0.02952998751;
        pressureValue = parseFloat(pressureValue).toFixed(2);
        skyValue = data['weather']['0']['main'];
        sunriseUnix = data['sys']['sunrise'];
        sunsetUnix = data['sys']['sunset'];

        //find our timezone and sunset/sunrise time
        let timezoneFromUTC = data['timezone'];
        timezoneFromUTC = timezoneFromUTC / 3600;
        let timezoneDiff = timezoneFromUTC - ourTimeZone;
        sunriseTime = moment.unix(sunriseUnix);
        sunsetTime = moment.unix(sunsetUnix);

        //changed the sunset and sunrise time based on timezone
        if(timezoneDiff > 0) {
            sunriseTime.add(Math.abs(timezoneDiff), 'h');
            sunsetTime.add(Math.abs(timezoneDiff), 'h');
        } else if(timezoneDiff < 0) {
            sunriseTime.subtract(Math.abs(timezoneDiff), 'h');
            sunsetTime.subtract(Math.abs(timezoneDiff), 'h');
        }

        sunrise.innerHTML = sunriseTime.format("h:mm A");
        sunset.innerHTML = sunsetTime.format("h:mm A");

        temp.innerHTML = tempValue;
        feelsLike.innerHTML = feelsValue;
        wind.innerHTML = windValue;
        humidity.innerHTML = humidityValue;
        visibility.innerHTML = visibilityValue;
        pressure.innerHTML = pressureValue;
        sky.innerHTML = skyValue;

        dir.innerHTML = calcWindDirection(windDirValue);

        //update image and sayings based on temp and or rain/snow
        if(skyValue == "Rain" || skyValue == "Mist"){
            capybaraImg.src = "capybaraRain.jpg";
            whatToWear = 'A coat';
            saying = "drip or drown and yo girl know mouth to mouth";
            capybaraFeeling = "Wet";

        } else if(skyValue == "Snow"){
            capybaraImg.src = "capybaraSnow.jpg";
            whatToWear = 'A winter coat, a hat, and some gloves';
            saying = 'Snow was falling, so much like stars filling the dark trees, that one could easily imagine its reason for being nothing more than prettiness.';
            capybaraFeeling = "Freezing";
        } else {
            if(tempValue <= 44){
                capybaraImg.src = "capybaraCold.jpg";
                whatToWear = 'A winter coat and a hat';
                capybaraFeeling = "Freezing";
                saying = 'It is beyond cold right now... stay inside';
            } else if(tempValue > 44 && tempValue < 60) {
                capybaraImg.src = "capybaraMild.jpg";
                whatToWear = 'Pants, maybe a jacket';
                capybaraFeeling = 'Mild';
                saying = 'Some men are born mediocre, some men achieve mediocrity, and some men have mediocrity thrust upon them';
            } else if(tempValue >= 60 && tempValue < 80) {
                capybaraImg.src = "capybaraWarm.jpg";
                whatToWear = 'Shorts, maybe a longsleeve';
                capybaraFeeling = 'Warm';
                saying = 'As snug as a bug in a rug';
            } else if(tempValue >= 80) {
                capybaraImg.src = "capybaraHot.jpg";
                whatToWear = 'Shorts';
                capybaraFeeling = 'Hot';
                saying = 'Cant stand the heat, get out of the kitchen!';
            }
        }
        
        cityname.innerHTML = cityName;
        feeling.innerHTML = capybaraFeeling;
        wear.innerHTML = whatToWear;
        whatToSay.innerHTML = saying;
    })
    .catch(err => alert("Wrong City")) //if api fails, alet the user

}

//calculate what direction the wind is coming from
function calcWindDirection(deg){

let windDirection = "N";

if(deg >= 348.75 || deg < 11.25){
    windDirection = "N";
} else if(deg >= 11.25 && deg < 33.75) {
    windDirection = "NNE";
} else if(deg >= 33.75 && deg < 56.25) {
    windDirection = "NE";
} else if(deg >= 56.25 && deg < 78.75) {
    windDirection = "ENE";
} else if(deg >= 78.75 && deg < 101.25) {
    windDirection = "E";
} else if(deg >= 101.25 && deg < 123.75) {
    windDirection = "ESE";
} else if(deg >= 123.75 && deg < 146.25) {
    windDirection = "SE";
} else if(deg >= 146.25 && deg < 168.75) {
    windDirection = "SSE";
} else if(deg >= 168.75 && deg < 191.25) {
    windDirection = "S";
} else if(deg >= 191.25 && deg < 213.75) {
    windDirection = "SSW";
} else if(deg >= 213.75 && deg < 236.25) {
    windDirection = "SW";
} else if(deg >= 236.25 && deg < 258.75) {
    windDirection = "WSW";
} else if(deg >= 258.75 && deg < 281.25) {
    windDirection = "W";
} else if(deg >= 281.25 && deg < 303.75) {
    windDirection = "WNW";
} else if(deg >= 303.75 && deg < 326.25) {
    windDirection = "NW";
} else if(deg >= 326.25 && deg < 348.75) {
    windDirection = "NNW";
}

return windDirection;
}