const sqlite3 = require("sqlite3").verbose();

let db = null; // Make DB part of global scope.


// This function opens/creates the user database.
// If the database is already open this function exits.
function openDatabase() {
	if (db != null)
		return;
	db = new sqlite3.Database("data/userdata.db", (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log("Connected to the user database");
	});
}

// This function closes the database connection.
// It is necessary to close the connection to the database after any changes have been made.
// If there is no active connection, then throw an error and exit.
function closeDatabase() {
	if (db == null)
		return console.error("Error: Database is not open.")
	db.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log("Database connection has been closed.");
	});
	db = null;
}

// Creates the categories and transactions tables if they don't exist.
// This should be run when starting up the program to ensure that the tables are there.
function createTables() {
	db.serialize(() => {
		db.run(
			"CREATE TABLE IF NOT EXISTS categories (	\
				category_id	INTEGER PRIMARY KEY,		\
				name		TEXT,						\
				color		TEXT						\
			)", [], (err) => {
				console.log("Categories table created!");
		}).run(
			"CREATE TABLE IF NOT EXISTS transactions (							\
				transaction_id INTEGER PRIMARY KEY,								\
				category_id INTEGER,											\
				date_of TEXT,													\
				description TEXT,												\
				amount REAL,													\
				FOREIGN KEY (category_id) REFERENCES categories (category_id)	\
			)"
		);
	});
}

// Adds default categories to categories table if none are present.
// This should be run when starting up the program to ensure that categories exist.
function populateCategoriesTable() {
	var categoriesExist = false;
	db.get(
		"SELECT * FROM categories", [], (err, row) => {
			if (err) {
				throw err;
			}
			categoriesExist = row ? true : false;
	});
	if (!categoriesExist) {
		db.parallelize(() => {
			var categories =
				["Groceries", "Rent", "Transportation",
				 "Entertainment", "Misc.", "Income"];
			var colors =
				["red", "blue", "yellow", "green",
				 "purple", "brown"];
			for (var i = 0; i < categories.length; i++) {
				addCategory(categories[i], colors[i]);
			}
		});
	}
}

// Make sure that the categories table has been created first.
function addCategory(name, color) {
	db.run("INSERT INTO categories VALUES (NULL, ?, ?)", [name, color], (err) => {
		if (err) {
			return console.log(err.message);
		}
	});
}

function addTransaction(category_id, date_of, description, amount) {
	db.run("INSERT INTO transactions VALUES(NULL, ?, ?, ?, ?)", [category_id, date_of, description, amount], (err) => {
		if (err) {
			return console.log(err.message);
		}
	});
}

function getCategoryList(sortBy) {
	var list;
	db.all("SELECT * FROM categories SORT BY ?", [sortBy ? sortBy : "category_id"], (err, rows) => {
		if (err) {
			throw err;
		}
		list = rows;
	});
	return list;
}

function getTransactionsList(sortBy) {
	var list;
	db.all("SELECT * FROM transactions SORT BY ?", [sortBy ? sortBy : date_of], (err, rows) => {
		if (err) {
			throw err;
		}
		list = rows;
	});
	return list;
}

function getTotalBalance() {
	var balance;
	db.get("SELECT SUM(amount) AS total FROM transactions", [], (err, row) => {
		if (err) {
			throw(err);
		}
		balance = row.total;
	});
	return balance;
}

openDatabase();
db.serialize(() => {
	createTables();
	populateCategoriesTable();
});
closeDatabase();



