var mysql = require("mysql");

var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password: "08061963nh",
	database: "bamazon"
});

function startFunction(){
	console.log("Grabbing store items...");
	var query = connection.query(
		"SELECT item_id, product_name, price FROM products", function(err, res){
			if (err) throw err;
			console.log(res);
			buyPrompt();
		});
}

function buyPrompt(){

		inquirer.
		prompt([
		{
			name: "idOfProduct",
			type: "input",
			message: "What is the ID of the product you'd like to buy?"

		},
		{
			name: "amountOfUnits",
			type: "input",
			message: "How many units would you like?"
		}
		]).then(function(res){

			var qty = res.amountOfUnits;
			var id = res.idOfProduct
			order(id, qty);

		})
	
}

function order(id, qty){

	var query = connection.query("SELECT stock_quantity, price FROM products WHERE ?",
	{
		item_id: id,

	},function(err, res){


		var currentQty = res[0].stock_quantity;
		var price = res[0].price;

		if (qty > currentQty) {

			console.log("Insufficient quantity");
			console.log("There are only " + res[0].stock_quantity + " available.");
			console.log("Retry.");
			buyPrompt();

		}
		else {

			currentQty -= qty;
			connection.query("UPDATE products SET ? WHERE ?",
				[
				{
					stock_quantity: currentQty
				},
				{
					item_id: id,
				}], function(err, res){
					if (err) throw err;
					var purchasePrice = qty * price;
					console.log("Remaining stock: " + currentQty);
					console.log("The cost of your purchase is $" + purchasePrice);
					connection.end();

				})
		}

	})
}

connection.connect(function(err){
	if (err) throw err;

	startFunction();
	

});