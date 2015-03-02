var http = require('http');
var express=require('express');
var app=express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

var personSchema = mongoose.Schema({
    id: Number,
    bank: Number, 
    price: Number,
    cost: Number,
    marketing: Number,
    quantity: Number
})

var Person = mongoose.model('Person', personSchema);
var p1 = new Person({id : 1, bank: 0, price: 0, cost: 0, marketing: 0, quantity: 0 });
var p2 = new Person({id : 2, bank: 0, price: 0, cost: 0, marketing: 0, quantity: 0 });
p1.save(function (err) {if (err) console.log ('Error on save!')});
p2.save(function (err) {if (err) console.log ('Error on save!')});

// 127.0.0.1:3000/bank/1
app.get('/bank/:id', function (req, res) {
	var id = req.param("id");
	console.log("GOT BANK!");
	if (id == 1)
	{
		res.jsonp({ asset: p1.bank});
	}
	else
	{
		res.jsonp({ asset: p2.bank});
	}
});

// 127.0.0.1:3000/1?price=1&cost=1&marketing=1&quantity=1
app.get('/:id', function (req, res) {
	console.log("new");
	var id = req.param("id");
	var price = req.param("price");
	var cost = req.param("cost");
	var marketing = req.param("marketing");
	var quantity = req.param("quantity");

	var person;
	var enemy;

	if (id == 1){
		person = p1;
		enemy = p2;
	}
	else
	{
		person = p2;
		enemy = p1;
	}

	console.log(price);
	console.log(cost);
	console.log(marketing);
	console.log(quantity);


	person.bank = person.bank;
	person.price = price;
	person.cost = cost;
	person.marketing = marketing;
	person.quantity = quantity;
	person.save(function (err) {if (err) console.log ('Error on save!')});

	if (enemy.price == 0 && enemy.cost == 0)
	{
		res.send("pending");
		return;
	}

	var bank = calculate(person, enemy).bank;
	res.send(bank.toString());
});

function calculate(p1, p2) {
	// so here we calculate profit for each person
	var sales = 100000 * (p1.marketing / 1000000000 + 0.01) * p1.price;
	var profit = sales * p1.price - p1.cost * p1.quantity - p1.marketing;
	p1.bank = p1.bank + profit;

	var sales = 100000 * (p2.marketing / 1000000000 + 0.01) * p2.price;
	var profit = sales * p2.price - p2.cost * p2.quantity - p2.marketing;
	p2.bank = p2.bank + profit;

	//wipe everything
	p1.price = 0;
	p1.cost = 0;
	p1.marketing = 0;
	p1.quantity = 0;
	p2.price = 0;
	p2.cost = 0;
	p2.marketing = 0;
	p2.quantity = 0;
	p1.save(function (err) {if (err) console.log ('Error on save!')});
	p2.save(function (err) {if (err) console.log ('Error on save!')});

    return p1, p2;
}


var server=app.listen(3000,function(){
	console.log("We have started our server on port 3000");
});

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   // yay!
// });

// var kittySchema = mongoose.Schema({
//     name: String
// })

// kittySchema.methods.speak = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name"
//   console.log(greeting);
// }

// var Kitten = mongoose.model('Kitten', kittySchema);

// var fluffy = new Kitten({ name: 'fluffy' });
// // fluffy.speak() // "Meow name is fluffy"

// fluffy.save(function (err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });

// Kitten.find(function (err, kittens) {
//   if (err) return console.error(err);
//   console.log(kittens)
// })


