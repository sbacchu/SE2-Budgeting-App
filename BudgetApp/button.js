function TransactionFunc() {
	document.getElementById("categ").style.display = "none";
	document.getElementById("trans").style.display = "block";
}

function CategoryFunc() {
	document.getElementById("trans").style.display = "none";
	document.getElementById("categ").style.display = "block";
}

function processTransaction() {
	console.log($("#description").val());
	console.log($("#amount").val());
	console.log($("#category").val());
	console.log($("#date").val());
}