// You can add the additional payment gateways here
var Paypal = require('./paypal.js');
var Braintree = require('./braintree.js');

function Payment(post_data, callback){
	
	var use_gateway;
	var cc_number = post_data.cc_number.toString();
	var currency = post_data.currency;
	var credit_card_type = '';
			
	// get the credit card type
	if(cc_number.substr(0,2) == "34" || cc_number.substr(0,2) == "37")
	{
		credit_card_type = 'amex';
	}
	else if(cc_number.substr(0,1)=="4")
	{
		credit_card_type = 'visa';
	}
	else if(cc_number.substr(0,1)=="5")
	{
		credit_card_type = 'mastercard';
	}
	else
	{
		// not support other credit card type
		var err = {responseText:'Not supported credit card type'};
		callback(err,null);
		return;
	}
	
	
	// handle the credit card logic
	if(credit_card_type == 'amex' && currency != 'USD')
	{
		// AMEX is possible to use only for USD
		var err = {responseText:'AMEX is possible to use only for USD'};
		callback(err,null);
		return;
	}
	
	// check the gateway
	if(credit_card_type == 'amex' && currency == 'USD')
	{
		use_gateway = 'Paypal';
	}
	else if(currency == 'USD' || currency == 'EUR' || currency == 'AUD')
	{
		use_gateway = 'Paypal';
	}
	else
	{
		use_gateway = 'Braintree';
	}
	
	post_data['type'] = credit_card_type;
	
	// handle the payment process
	if(use_gateway == 'Paypal')
	{
		Paypal(post_data,function(err,response){
			if(err)
			{
				callback(err,null);
			}
			else
			{
				callback(null,response);
			}
		});
	}
	else if(use_gateway == 'Braintree')
	{
		Braintree(post_data,function(err,response){
			if(err)
			{
				callback(err,null);
			}
			else
			{
				callback(null,response);
			}
		});
	}
}

module.exports = Payment;