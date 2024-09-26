import LocationController from "./locationController.js";
import HistoryStorage from "./storage.js";
import SubscriptionController from "./subscription.js";
import WeatherDisplayer from "./weather_displayer.js";

let locationId = 2718413;
let baseUrl;

document.addEventListener("DOMContentLoaded", async () => {


    const response = await fetch('/api/config');
    const config = await response.json();
    baseUrl = config.HOST;

    console.log(document.getElementById('load-more'));

    const historyStorage = new HistoryStorage(
        document.querySelector('.history'),
        document.querySelector('.history-empty'),
        document.getElementById('history-card')
    )

    historyStorage.display();

    const weatherDisplayer = new WeatherDisplayer(
        locationId,
        baseUrl,
        document.getElementById('forecasts'),
        document.getElementById('default-card'),
        document.getElementById('weather-card'),
        document.getElementById('load-more'),
        historyStorage
    )

    await weatherDisplayer.updateLocation(locationId);

    const locationController = new LocationController(
        baseUrl,
        document.getElementById('searchComponent'),
        weatherDisplayer,
    );

    const subscribeController = new SubscriptionController(
        baseUrl,
        document.getElementById('subscriptionComponent'),
        document.getElementById('unsubscriptionComponent'),
        weatherDisplayer,
    )
})
