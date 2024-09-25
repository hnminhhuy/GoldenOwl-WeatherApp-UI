class LocationController {
    constructor(btnLocator, weatherDisplayer) {
        this.weatherDisplayer = weatherDisplayer
        this.btnLocator = btnLocator
        this.navigatorSupported = "geolocation" in navigator;

        this.btnLocator.onclick = () => {
            this.locate();
        }
    }

    locate() {
        if (this.navigatorSupported) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    console.log(`Latitude: ${lat}, Longtitude: ${long}`);
                    const query = `${lat},${long}`;

                    this.weatherDisplayer.updateLocation(query);
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

    

}

export default LocationController;