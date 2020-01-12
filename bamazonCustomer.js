// 
var mysql = require("mysql");
var inquirer = require("inquirer");
ctable = require("console.table")
// 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});
// connection point
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected id ", connection.threadId);
    afterCon();
});
// 
function afterCon() {
    departments = [];
    department = "";
    inquirer.prompt([{
            type: "confirm",
            message: "Welcome to Bamazon!!" + "\n",
            name: "run1"
        },{
            type: "list",
            message: "would you like to shop" + "\n",
            name: "run",
            choices:["Shop", "Exit"]
        }])
        .then(function (answer) {
            if (answer.run == "Shop") {
                itemSearch();
            } else {    
                connection.end();
            }
        });
}
// 
function itemSearch() {
    connection.query("SELECT * FROM products" +
        department,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            inquirer.prompt([{
                        name: "item",
                        type: "input",
                        message: "Enter the Id Num of the item would you like." + "\n"
                    },
                    {
                        name: "amount",
                        type: "input",
                        message: "Enter the amount of the item would you like." + "\n"
                    }
                ])
                // select the product the user choose by item_id *currently not functioning*
                .then(function (answer) {
                    connection.query("SELECT * FROM products WHERE ?", [{
                        item_id: answer.item
                    }], function (err, res1) {
                        if (res1[0].stock_quantity > answer.amount) {
                            connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE ?",
                                [
                                    parseInt(answer.amount),
                                    {
                                        item_id: answer.item
                                    }
                                ],
                                function (err, res2) {
                                    if (err) throw err;
                                    if (answer.amount > 1) {
                                        console.log(answer.amount + " unit of " + res1[0].item_id + " has been purchased for $" + (answer.amount * res1[0].price) + " !");
                                    } else {
                                        console.log(answer.amount + " units of " + res1[0].item_id + " have been purchased for $" + (answer.amount * res1[0].price) + " !");
                                    }
                                    afterCon();
                                });
                        } else {
                            console.log("insufficient quantity!");
                            afterCon();
                        }
                        if (err) throw err;
                    });
                });
        });
};
//