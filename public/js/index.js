import LocationController from "./locationController.js";
import WeatherDisplayer from "./weather_displayer.js";

let locationId = 2718413;
const baseUrl = `http://localhost:4000`

document.addEventListener("DOMContentLoaded", async () => {

    console.log(document.getElementById('load-more'));

    const weatherDisplayer = new WeatherDisplayer(
        locationId,
        baseUrl,
        document.getElementById("forecasts"),
        document.getElementById('default-card'),
        document.getElementById('weather-card'),
        document.getElementById('load-more')
    )

    await weatherDisplayer.updateLocation(locationId);

    const locationController = new LocationController(
        document.getElementById('btn-locator'),
        weatherDisplayer,
    );
})
