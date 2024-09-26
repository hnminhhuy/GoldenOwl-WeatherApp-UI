class SubscriptionController {
    constructor(baseUrl, subscriptionComponent, unsubscribeComponent, weatherDisplayer) {
        this.baseUrl = baseUrl;
        // Subscribe
        this.btnSubscribe = subscriptionComponent.querySelector('#btnSubscribe');
        this.email = subscriptionComponent.querySelector('#subscribe-email');
        this.feedback = subscriptionComponent.querySelector('#subscribe-feedback');
        // Unsubsribe

        this.btnUnsubscribe = unsubscribeComponent.querySelector('#btnUnsubscribe');
        this.unsubscribeEmail = unsubscribeComponent.querySelector('#unsubscribe-email');
        this.unsubscribeFeedback = unsubscribeComponent.querySelector('#unsubscribe-feedback');

        this.weatherDisplayer = weatherDisplayer;

        this.btnSubscribe.onclick = async () => {
            this.weatherDisplayer.toggleLoading(this.btnSubscribe, true);
            await this.subscribe();
            weatherDisplayer.toggleLoading(this.btnSubscribe, false);
        }

        this.btnUnsubscribe.onclick = async () => {
            this.weatherDisplayer.toggleLoading(this.btnUnsubscribe, true);
            await this.unsubscribe();
            this.weatherDisplayer.toggleLoading(this.btnUnsubscribe, false);
        }
    }

    updateValidation(input, feedback, message, isSuccess = true) {
        input.classList.remove('is-valid', 'is-invalid');
        if (!isSuccess) {
            feedback.textContent = message;
            feedback.style.display = 'block';
            input.classList.add('is-invalid');
        } else {
            input.classList.add('is-valid');
            feedback.style.display = 'none';
        }
    }

    validate(input, feedback) {
        const email = input.value;
        input.classList.remove('is-valid', 'is-invalid');
        let valid = email != "";
        this.updateValidation(input, feedback, "Email is require", valid);
        return {valid, email};
    }

    dimissModal(id) {
        var modalElement = document.getElementById(id);
        var modalInstance = bootstrap.Modal.getInstance(modalElement); // Retrieve existing modal instance
        modalInstance.hide();
    }

    showToast(message) {
        var toastElement = document.getElementById('subscribeToast');
        toastElement.querySelector(".toast-body").textContent = message
        var toast = new bootstrap.Toast(toastElement);
        toast.show();
    }

    async subscribe() {
        const {valid, email} = this.validate(this.email, this.feedback);
        const location = this.weatherDisplayer.locationQuery;
        if (valid) {
            try {
                const sendData = {
                    email: email,
                    location: location,
                }   
                const res = await fetch(
                    `${this.baseUrl}/subscribe`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: "include",
                        body: JSON.stringify(sendData),
                    }
                );
                const data = await res.json();
               
                if (data.status == 400) {
                    this.updateValidation(this.email, this.feedback, data.message, false);
                } else {
                    this.showToast("You have successfully subscribed to daily forecasts! Please check email to confirm!");                    
                    this.dimissModal('subscribe-modal');
                }

            }
            catch(error) {
                console.error('Error:', error);
                // Handle error (e.g., show an error message)
            }
        }
    }

    async unsubscribe() {
        const {valid, email} = this.validate(this.unsubscribeEmail, this.unsubscribeFeedback);
        if (valid) {

            try {
                const res = await fetch(`${this.baseUrl}/subscribe/requestUnsubscribe?email=${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                })
                const data = await res.json();
                if (data.status == 400) {
                    this.updateValidation(this.unsubscribeEmail, this.unsubscribeFeedback, data.message, false);
                } else {
                    this.showToast("Your request is recorded! Please check your email to complete unsubscription.");                    
                    this.dimissModal('unsubscribeModal');
                }
            }
            catch(error) {
                console.error('Error:', error);
                // Handle error (e.g., show an error message)
            }
        }
    }

}

export default SubscriptionController;