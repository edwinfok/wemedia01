var paypal = require('paypal-rest-sdk');

module.exports = function(post_data, callback){
	// config paypal api
	var config = {
		'mode': 'sandbox', //sandbox or live
        'client_id': 'AVd6FWWwJrP_ttQfTZnQIWvBcHP3h0zlBA0Gjg2a0eezfmUDcxRg7pfmlGKfAM3oWbvtw6wItVf76QBA',
        'client_secret': 'EKT2GSWIzd1yg-O0OC1razAON-CId8qasQsLfF8TIb2pkrFTOZ7yGbiuLoL2bgQrEi70bfQ8jrVL0z9H'
	};
	paypal.configure(config);
  	
  	var create_payment_json = {
	    "intent": "sale",
	    "payer": {
	        "payment_method": "credit_card",
	        "funding_instruments": [{
	            "credit_card": {
	                "type": post_data.type,
	                "number": post_data.cc_number,
	                "expire_month": post_data.cc_expiration_month,
	                "expire_year": post_data.cc_expiration_year,
	                "cvv2": post_data.ccv,
	                "first_name": post_data.cc_holder_name,
	                //"last_name": ''
	            }
	        }]
	    },
	    "transactions": [{
	        "amount": {
	            "total": post_data.price,
	            "currency": post_data.currency
	        },
	        "description": "This is the payment transaction description."
	    }]
	};
  	
	paypal.payment.create(create_payment_json, function (error, payment) {
		if (error) {
			if (callback && (typeof callback === 'function')) {
				error.response.responseText = error.response.message;
				callback(error.response, null);
			}
			return;
		}
		if (callback && (typeof callback === 'function')) {
			callback(null, {
				transaction_id: payment.id,
				created_time: payment.create_time,
				updated_time: payment.update_time,
				intent: payment.intent,
				status: payment.state,
				gateway: "paypal"
			});
		}
	})
}
