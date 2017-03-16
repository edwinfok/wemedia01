var braintree = require('braintree');

module.exports = function(post_data, callback){
	var gateway = braintree.connect({
		environment:  braintree.Environment.Sandbox,
		merchantId:   "3qxcsvvj3npq2ycq",
		publicKey:    "v94xvrkyztz3v4d6",
		privateKey:   "a8e3884c03d8f01fd0956bab2ee60838"
	});

	gateway.transaction.sale({
		amount: post_data.price,
		creditCard: {
			cardholderName: post_data.cc_holder_name,
			number: post_data.cc_number,
			cvv: post_data.cvv,
			expirationMonth: post_data.cc_expiration_month,
			expirationYear: post_data.cc_expiration_year
		}
	}, function (err, res) {
		if (err) {
			if (callback && (typeof callback === 'function')) {
				callback(err, null);
			}
			return;
		}

		if (!(res.transaction) || res.transaction.status !== 'authorized') {
			err = (res.message || 'Unknown error');

			if (callback && (typeof callback === 'function')) {
				callback(err, null);
			}
			return;
		}

		if (callback && (typeof callback === 'function')) {
			callback(null, {
				transaction_id: res.transaction.id,
				created_time: res.transaction.createdAt,
				updated_time: res.transaction.updatedAt,
				intent: res.transaction.type,
				status: res.transaction.status,
				gateway: "braintree"
			});
		}
		return;
	});
}
