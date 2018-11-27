function TransactionFunc() {
	document.getElementById("categ").style.display = "none";
	document.getElementById("trans").style.display = "block";
}

function CategoryFunc() {
	document.getElementById("trans").style.display = "none";
	document.getElementById("categ").style.display = "block";
}

function processTransaction() {
	var desc = $("#description").val();
	var amount = $("#amount").val();
	var cat = $("#category").val();
	var date = $("#date").val();
	
	if (desc && amount && cat && date) {
		$("#addModal").modal("hide");
	}
}

function createCategoryDropDown() {
}

// Clear modal forms when they are closed.
$(document).ready(function() {
	$('.modal').on('hidden.bs.modal', function(){
		$(this).find('form')[0].reset();
	})
});