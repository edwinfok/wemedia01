var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var transactionSchema = Schema({
	_id: String,
	customer_name: String,
	customer_phone_number: String,
	currency: String,
	price: String,
	cc_holder_name: String,
	cc_number: String,
	cc_expiration_month: String,
	cc_expiration_year: String,
	ccv: String,
	response_id: String,
	response_created_time: Date,
	response_updated_time: Date,
	response_intent: String,
	response_status: String,
	response_gateway: String,
	created_time: { type: Date, default: Date.now },
}, { _id: false, minimize: false });

mongoose.Promise = global.Promise;
mongoose.model('Transaction', transactionSchema);
mongoose.connect( 'mongodb://127.0.0.1/offsite_test' );
