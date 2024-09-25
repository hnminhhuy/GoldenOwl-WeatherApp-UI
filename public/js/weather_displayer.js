class WeatherDisplayer {
    constructor(
        locationQuery, 
        baseUrl, 
        forecastContainer, 
        currentContainer, 
        template, 
        btnLoadMore)
    {
        this.start = 1;
        this.offset = 4;
        this.locationQuery = locationQuery;
        this.baseUrl = baseUrl;
        this.forecastContainer = forecastContainer;
        this.currentContainer = currentContainer;
        this.template = template;
        this.btnLoadMore = btnLoadMore;

        this.btnLoadMore.onclick = () => { this.loadMore(); }
    }

    async updateLocation(newLocation) {
        this.locationQuery = newLocation;
        this.forecastContainer.replaceChildren();
        this.start = 1;
        this.offset = 4;
        await this.fetchWeatherData();
        this.btnLoadMore.disabled = false;
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

    genWeatherCard(data) {
        const clone = this.template.content.cloneNode(true);
        this.bindingData(clone, data);
        return clone;
    }
    
    
    fetchWeatherData() {
        console.log("Fetching data");
        fetch(`${this.baseUrl}/weather/forecast?city=id:${this.locationQuery}&days=${this.offset}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not OK');
            }
            
            return res.json();
        }).then(data => {
            if (this.start == 1) {
                this.bindingData(this.currentContainer, data.forecasts[0], true, data.location.name);
            }

            for(let i = this.start; i < data.forecasts.length; i++) {
                const content = this.genWeatherCard(data.forecasts[i]);
                this.forecastContainer.appendChild(content);
            }    
            this.start = this.offset;
            this.offset += 3;
        })
    }

    loadMore() {
        if (this.offset > 14) this.btnLoadMore.disabled = true;
        this.fetchWeatherData();
    }
}

export default WeatherDisplayer;