// Loads jQuery package from node_modules
var $ = require("jquery");

// JS is equivalent to the normal "bootstrap" package
// no need to set this to a variable, just require it
require("bootstrap-sass");


$(document).ready(function() {
	let $rankingModalBtn = $("#rankingModalBtn"),
		$rankingList = $("#rankingList");

	$rankingModalBtn.on("click", function(e){
		e.preventDefault();

		let $this = $(this),
			$url = $this.attr("data-url"),
			$htmlcontent = '';

		$.ajax({
			url: $url,
			method: "post",
			data: {},
			type: "json",
			beforeSend: () => {
				$rankingList.html('Cargando...');
			},
			success: function(users) {
				$.each(JSON.parse(users), (index, user) => {
					$htmlcontent += '<li>' + user.name + ' - <span>' + user.score + '</span></li>';
				});

				$rankingList.html($htmlcontent);
			},
			error: function(error) {
				console.error("An unhandled error occurred in ajax success callback: " + error);
			}
		});
	});
});
