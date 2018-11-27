const sqlite3 = require("sqlite3").verbose();

let db = null; // Make DB part of global scope.


// This function opens/creates the user database.
// If the database is already open this function exits.
function openDatabase() {
	if (db != null)
		return;
	db = new sqlite.Database("/data/userdata.db", (err) => {
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
	openDatabase();
	db.serialize(() => {
		db.run(
			"CREATE TABLE IF NOT EXISTS categories (	\
				category_id	INTEGER PRIMARY KEY,		\
				name		TEXT,						\
				color		TEXT						\
			)"
		).run(
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
	closeDatabase();
}

// Adds default categories to categories table if none are present.
// This should be run when starting up the program to ensure that categories exist.
function populateCategoryTable() {
	openDatabase();
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
				addDefaultCategory(categories[i], colors[i]);
			}
		});
	}
	closeDatabase();
}

function addDefaultCategory(name, color) {
	db.run("INSERT INTO categories VALUES (NULL, ?, ?)", [name, color], function(err) {
		if (err) {
			return console.log(err.message);
		}
	});
}


