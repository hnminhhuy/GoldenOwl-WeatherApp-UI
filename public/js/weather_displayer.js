class WeatherDisplayer {
    constructor(
        locationQuery, 
        baseUrl, 
        forecastContainer, 
        currentContainer, 
        template, 
        btnLoadMore,
        storage)
    {
        this.start = 1;
        this.offset = 4;
        this.locationQuery = locationQuery;
        this.baseUrl = baseUrl;
        this.forecastContainer = forecastContainer;
        this.currentContainer = currentContainer;
        this.template = template;
        this.btnLoadMore = btnLoadMore;
        this.storage = storage;

        this.btnLoadMore.onclick = () => { this.loadMore(); }
    }

    async updateLocation(newLocation) {
        this.locationQuery = newLocation;
        this.forecastContainer.replaceChildren();
        this.start = 1;
        this.offset = 4;
        await this.fetchWeatherData();
        this.btnLoadMore.disabled = false;
        if (newLocation) {
            document.querySelector("#trigger-subscribe").disabled = false;
        } else {
            document.querySelector("#trigger-subscribe").disabled = true;
        }
    }

    bindingData(container, data, bindLocation = false, location = '') {
        container.querySelector('.weather-card-date').textContent = data.date;
        container.querySelector('.weather-card-temp').textContent = `${data.temp} °C`;
        container.querySelector('.weather-card-hum').textContent = `${data.humidity}%`;
        container.querySelector('.weather-card-wind').textContent = `${data.wind} km/h`;
        container.querySelector('.weather-card-icon').src = data.condition.icon;
        if (bindLocation) {
            container.querySelector('.weather-card-location').textContent = location;
            container.querySelector('.weather-card-condition').textContent = data.condition.text;
        }
    }

    toggleLoading(button, state = true) {
        button.disabled = state;
        if (state) {
            button.querySelector('.spinner-border').style = "";
        } else {
            button.querySelector('.spinner-border').style.display = 'none';
        }
    } 

    genWeatherCard(data) {
        const clone = this.template.content.cloneNode(true);
        this.bindingData(clone, data);
        return clone;
    }
    
    
    async fetchWeatherData() {
        const res = await fetch(`${this.baseUrl}/weather/forecast?city=id:${this.locationQuery}&days=${this.offset}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
        })
        if (!res.ok) {
            throw new Error('Network response was not OK');
        }
        
        const data = await res.json();
        
        if (this.start == 1) {
            this.bindingData(this.currentContainer, data.forecasts[0], true, data.location.name);
            const savedData =  data.forecasts[0];
            savedData.location = data.location.name;
            savedData.id = this.locationQuery;
            console.log(savedData);
            this.storage.saveWeather(savedData);
        }

        for(let i = this.start; i < data.forecasts.length; i++) {
            const content = this.genWeatherCard(data.forecasts[i]);
            this.forecastContainer.appendChild(content);
        }    
        this.start = this.offset;
        this.offset += 3;

    }

    async loadMore() {
        this.toggleLoading(this.btnLoadMore, true);
        await this.fetchWeatherData();
        this.toggleLoading(this.btnLoadMore, false);
        if (this.offset > 14) this.btnLoadMore.disabled = true;
    }
}

export default WeatherDisplayer;