var mysql = require("mysql");

var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password: "08061963nh",
	database: "bamazon"
});

connection.connect(function(err){
	if (err) throw err;

	displayItems();

	// buyPrompt();
	

});

function displayItems(){
	console.log("Grabbing store items...");
	var query = connection.query(
		"SELECT item_id, product_name, price FROM products", function(err, res){
			if (err) throw err;
			console.log(res);
		});
}

function buyPrompt(){

		inquirer.
		prompt(
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
		).then(function(res){

			console.log(res);

		});
	
}