class HistoryStorage {
    constructor(historyContainer, placeHolder, template) {
        this.placeHolder = placeHolder
        this.historyContainer = historyContainer;
        this.template = template;
    }

    saveWeather(data) {
        if (!data || !data.id) {
            console.error('Invalid weather data or missing id');
            return; 
        }

        let weatherHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];

        const saveData = {
            weather: data,
            timestamp: new Date().getTime(),
        }
        
        const haveDuplicate = weatherHistory.find(w => w.weather.id === data.id);

        if (!haveDuplicate) {
            weatherHistory.push(saveData); 
            localStorage.setItem('weatherHistory', JSON.stringify(weatherHistory));
            this.display();
        }
    }

    isSameDay(storedTimestamp) {
        const storedDate = new Date(storedTimestamp);
        const today = new Date();
        
        return storedDate.getFullYear() === today.getFullYear() &&
               storedDate.getMonth() === today.getMonth() &&
               storedDate.getDate() === today.getDate();
    }

    bindingData(container, data) {
        container.querySelector('.weather-card-temp').textContent = `${data.weather.temp} °C`;
        container.querySelector('.weather-card-hum').textContent = `${data.weather.humidity}%`;
        container.querySelector('.weather-card-wind').textContent = `${data.weather.wind} km/h`;
        container.querySelector('.weather-card-icon').src = data.weather.condition.icon;
        container.querySelector('.weather-card-location').textContent = data.weather.location;
        container.querySelector('.weather-card-condition').textContent = data.weather.condition.text;
    }

    generateUI(data) {
        const clone = this.template.content.cloneNode(true);
        this.bindingData(clone, data);
        return clone;
    }

    getStoredData() {
        let weatherHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
        weatherHistory = weatherHistory.filter(data => this.isSameDay(data.timestamp));
        localStorage.setItem('weatherHistory', JSON.stringify(weatherHistory));
        return weatherHistory.length ? weatherHistory : null;
    }

    display() {
        const weatherData = this.getStoredData();
        console.log(weatherData);
        if (weatherData) {
            this.historyContainer.replaceChildren();
            this.placeHolder.classList.add('hidden');
            this.historyContainer.classList.remove('hidden');
            // Display each weather record from today
            weatherData.forEach(record => this.historyContainer.appendChild(this.generateUI(record)));
        } else {
            this.placeHolder.classList.remove('hidden');
            this.historyContainer.classList.add('hidden');
        }
    }
}

export default HistoryStorage;