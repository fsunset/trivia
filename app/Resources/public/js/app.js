// Loads jQuery package from node_modules
var $ = require("jquery");

// JS is equivalent to the normal "bootstrap" package
// no need to set this to a variable, just require it
require("bootstrap-sass");


$(document).ready(function() {
	let
		// Globals
		$buyModalBtn = $("#buyModalBtn"),
		$buyModal = $("#buyModal"),
		$termsModalBtn = $("#termsModalBtn"),
		$termsModal = $("#termsModal"),
		$rankingModalBtn = $("#rankingModalBtn"),
		$rankingModal = $("#rankingModal"),
		$rankingList = $("#rankingList"),
		thisUserId = $rankingList.attr("data-this-user"),
		$totalUsers = $("#totalUsers"),

		// Register Form
		$registrationForm = $("#fosUserRegistrationRegister"),
		$isAssociatedCheckbox  = $("#fos_user_registration_form_isAssociated"),
		$acceptedTermsCheckbox  = $("#fos_user_registration_form_acceptedTerms"),

		// Player Dashboard
		$roulette = $("#roulette"),
		$roulettePNGPath = $roulette.attr("src"),
		$rouletteGIFPath = $roulette.attr("data-src"),
		$startRouletteBtn = $("#startRoulette"),
		$stopRouletteBtn = $("#stopRoulette")
		;

	$buyModalBtn.on("click", function(e) {
		e.preventDefault();

		$buyModal.modal("show");
	});

	$termsModalBtn.on("click", function(e) {
		e.preventDefault();

		$termsModal.modal("show");
	});

	$rankingModalBtn.on("click", function(e) {
		e.preventDefault();

		let $this = $(this),
			$url = $this.attr("data-url"),
			$htmlcontent = "",
			loaderPath = $this.attr("data-loader"),
			htmlLoader = "<li class='text-center loader-container'><img src=" + loaderPath + " alt='Cargando...'></li>",
			totalUsers = 0,
			userClassHeader = "";

		$.ajax({
			url: $url,
			method: "post",
			data: {},
			type: "json",
			beforeSend: () => {
				$rankingList.html(htmlLoader);
			},
			success: function(users) {
				$.each(JSON.parse(users), (index, user) => {
					thisUserId == user.id ? userClassHeader = " header" : userClassHeader = "";

					$htmlcontent += "<div class='col-xs-2 text-center player-row" + userClassHeader + "'>" + parseInt(index+1) + "</div><div class='col-xs-8 player-name player-row" + userClassHeader + "'>" + user.name + "</div><div class='col-xs-2 text-center player-row" + userClassHeader + "'>" + user.score + "</div>";

					totalUsers = user.totalUsers;
				});

				$rankingList.html($htmlcontent);
				$totalUsers.html(totalUsers);
				$rankingModal.modal("show");
			},
			error: function(error) {
				console.error("An unhandled error occurred in ajax success callback: " + error);
			}
		});
	});

	$startRouletteBtn.on("click", function() {
		$roulette.attr('style', 'width:326px!important; margin-top:78px; margin-bottom:63px').attr("src", $rouletteGIFPath);
	});

	$stopRouletteBtn.on("click", function() {
		$roulette.attr('style', ' ').attr("src", $roulettePNGPath);
	});
});
