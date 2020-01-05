// 
var mysql = require("mysql");
var inquirer = require("inquirer");
ctable = require("console.table")
// 
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});
// 
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected id ", connection.threadId);
    readInventory()
    itemSearch();
});
// 
function readInventory() {
    connection.query("SELECT * FROM bamazon_db.products", function (err, res) {
        if (err) throw err;
        console.table(res);
    });
};
// 
function itemSearch() {
    inquirer.prompt([{
            name: "item",
            type: "input",
            message: "Enter the Id Num of the item would you like." + "\n"
        },
        {
            name: "amount",
            type: "input",
            message: "Enter the amount of the item would you like." + "\n"
        }])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE ?",
                [{
                    item_id: answer.item
                }],
                function (err, res1) {

                        connection.query("Update products SET stock_quantity = stock_quantity - ? WHERE ?",
                            [
                                parseInt(answer.amount),
                                {
                                    item_id: answer.item
                                }
                            ],
                            function (err, res) {
                                console.log("hello world!!")
                                if (err) throw err;
                                if (res1[0].stock_quantity > 1) {
                                    console.log(res1[0].stock_quantity + "purchase completed")
                                } else {
                                    console.log(res1[0].stock_quantity + "purchase incomplete")
                                }
                                if (err) throw err;
                            })

                })
        })
}

//                 console.log(
//                     "id: " +
//                     res[0].item_id +
//                     " || name: " +
//                     res[0].product_name +
//                     " || dept: " +
//                     res[0].department_name +
//                     " || price: " +
//                     res[0].price +
//                     " || amount: " +
//                     res[0].stock_quantity
// 