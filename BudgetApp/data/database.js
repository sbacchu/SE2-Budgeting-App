const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("/data/userdata.db", sqlite3.OPEN_CREATE, (err) => {
	if (err) {
		console.log(err);
	}
	console.log("Connected to user database.");
});