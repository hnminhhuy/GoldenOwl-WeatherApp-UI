class LocationController {

    constructor(baseUrl, searchComponent, weatherDisplayer) {
        this.baseUrl = baseUrl;
        this.btnLocator = searchComponent.querySelector('#btn-locator');
        this.searchBox =  searchComponent.querySelector('#searchLocation');
        this.searchButton = searchComponent.querySelector('#btn-search');
        this.autoComplete = searchComponent.querySelector('#locationList');
        this.feedback = searchComponent.querySelector('#search-feedback');

        this.weatherDisplayer = weatherDisplayer;
        this.navigatorSupported = "geolocation" in navigator;
        this.debounceTimer = null;
        this.locationList = null;

        this.btnLocator.onclick = async (event) => {
            this.toggleLoading(this.btnLocator, true);
            await this.locate();
        }

        this.searchBox.addEventListener('input', (e) => {
            const currentValue = e.target.value;
            clearTimeout(this.debounceTimer);

            this.debounceTimer = setTimeout(() => {
                this.searchLocation(currentValue);
            }, 500);
        });

        this.searchBox.addEventListener('keydown', (event) => {
            if (event.key == 'Enter') {
                event.preventDefault();
                this.getForecast();
            }
        })

        this.searchButton.onclick = () => {
            this.getForecast();
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

    locate() {
        if (this.navigatorSupported) {
            this.toggleLoading(this.btnLocator, true);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    console.log(`Latitude: ${lat}, Longtitude: ${long}`);
                    const query = `${lat},${long}`;

                    await this.weatherDisplayer.updateLocation(query);
                    this.toggleLoading(this.btnLocator, false);
                },
                (error) => {
                    console.error("Error: ", error);
                },
                {
                    enableHighAccuracy: true,
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.")
        }
    }

    updateAutoComplete() {
        this.autoComplete.replaceChildren();
        this.locationList.forEach(location => {
            console.log(location);
            const option = document.createElement('option');
            option.value = `${location.name}, ${location.country}`;
            option.id = location.id;

            this.autoComplete.appendChild(option);
        });
    }

    searchLocation(query) {
        fetch(`${this.baseUrl}/weather/search?city=${query}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then(res => {
                if (!res.ok) {
                    throw new Error('Search location unsuccessfully');
                }

                return res.json();
            }).then(data => {
                this.locationList = data;
                this.updateAutoComplete();
                if (this.locationList.length > 0) {
                    this.updateFeedback('Looks good!', true);
                }
            })
    }

    updateFeedback(message, isSuccess = false) {
        this.feedback.textContent = message;
        this.feedback.style.display = 'block';

        this.feedback.classList.remove('text-success', 'text-danger');
        this.searchBox.classList.remove('is-valid', 'is-invalid');
        if (isSuccess) {
            this.searchBox.classList.add('is-valid');
            this.feedback.classList.add('text-success');
        } else {
            this.searchBox.classList.add('is-invalid');
            this.feedback.classList.add('text-danger');
        }
    }

    async getForecast() {
        const input = this.searchBox.value;

        // Search for the location
        const res = this.locationList.find(location => {
            return `${location.name}, ${location.country}` == input || location.name == input || location.country == input;
        })

        // Handle error
        if (!res) {
            this.updateFeedback("Can't find the location!");
        } else {   
            this.toggleLoading(this.searchButton, true);
            await this.weatherDisplayer.updateLocation(res.id);
            this.toggleLoading(this.searchButton, false);
        }

    }

}

export default LocationController;