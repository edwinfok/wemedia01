var express = require('express');
var router = express.Router();
var Payment = require('../lib/payment.js');
var mongoose = require( 'mongoose' );
var Transaction = mongoose.model( 'Transaction' );
var redis = require('redis');
var client = redis.createClient();

/* Get the year select according to current time */
function getYearSelect()
{
	var currentTime = new Date();
	// returns the year (four digits)
	var year = currentTime.getFullYear();
	var year_array = [year];
	for(var i=1; i <= 10; i++)
	{
		year = year+1;
		year_array.push(year);
	}
	
	return year_array;
}

/* GET home page */
router.get('/', function(req, res, next) {

	// generate credit card year
	var year_array = getYearSelect();
	
	var data = {
		'title':'Create Payment',
		'year_array':year_array,
		'request_body':req.body,
	};
	
	res.render('index', { data });
});

/* Post home page */
router.post('/', function(req, res, next) {
	
	var o_payment = new Payment(req.body, function(err, response){

		if(err)
		{
			res.send(err);
			return;
		}
		else
		{
			// save to mongodb
			var a_set = {
				_id: response.transaction_id,
				customer_name: req.body.customer_name,
				customer_phone_number: req.body.customer_phone_number,
				currency: req.body.currency,
				price: req.body.price,
				cc_holder_name: req.body.cc_holder_name,
				cc_number: req.body.cc_number,
				cc_expiration_month: req.body.cc_expiration_month,
				cc_expiration_year: req.body.cc_expiration_year,
				ccv: req.body.ccv,
				response_id: response.transaction_id,
				response_created_time: response.created_time,
				response_updated_time: response.updated_time,
				response_intent: response.intent,
				response_status: response.status,
				response_gateway: response.gateway
			};
			
			new Transaction(a_set).save( function( mongo_err, transaction, count ){
				if(mongo_err)
				{
					res.send(mongo_err);
					return;
				}
				else
				{
					// update the redis cache
					client.hmset(response.transaction_id+"_"+req.body.customer_name,a_set,function(redis_err,reply){
						if(redis_err)
						{
							res.send(redis_err);
							return;
						}
						else
						{
							res.send(response);
							return;
						}
					});
				}
			});
		}
	});
});

/* Get check payment page */
router.get('/check_payment', function(req, res, next) {
	var error = false;
	
	var data = {
		'title':'Check Payment',
		'request_body':req.body,
	};
	
	res.render('check_payment', { data });
});

/* Post check payment page */
router.post('/check_payment', function(req, res, next) {

	// Get the search form value
	var customer_name = req.body.customer_name;
	var payment_reference_code = req.body.payment_reference_code;
	
	// Found the record in redis cache
	client.hgetall(payment_reference_code+"_"+customer_name,function(redis_err,result_set){
		if(redis_err)
		{
			var response = {'succ': false};
			res.send(response);
			return;
		}
		else
		{
			// Found in cache
			if(result_set)
			{
				var response = {
					'succ': true,
					'customer_name': result_set.customer_name,
					'customer_phone_number': result_set.customer_phone_number,
					'currency': result_set.currency,
					'price': result_set.price
				};
				res.send(response);
				return;
			}
			else
			{
				// if not found in cache or cache expired
				// try to found in database
				Transaction.findOne({"_id":payment_reference_code,"customer_name":customer_name},function(err,transaction){
					if(transaction)
					{
						// update the redis cache
						client.hmset(transaction.response_id+"_"+transaction.customer_name,transaction);
						
						var response = {
							'succ': true,
							'customer_name': transaction.customer_name,
							'customer_phone_number': transaction.customer_phone_number,
							'currency': transaction.currency,
							'price': transaction.price
						};
						res.send(response);
						return;
					}
					else
					{
						var response = {'succ': false};
						res.send(response);
						return;
					}
				});
			}
		}
	});
});

module.exports = router;
