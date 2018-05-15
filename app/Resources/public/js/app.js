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
		$termsModalTriggers = $("#termsModalBtn, #termsModalLink"),
		$termsModal = $("#termsModal"),
		$rankingModalBtn = $("#rankingModalBtn"),
		$rankingModal = $("#rankingModal"),
		$rankingList = $("#rankingList"),
		thisUserId = $rankingList.attr("data-this-user"),
		$totalUsers = $("#totalUsers"),

		// Register Form
		$fosUserRegistrationForm = $("#fosUserRegistrationForm"),
		$isAssociatedCheckbox  = $("#fos_user_registration_form_isAssociated"),
		$acceptedTermsCheckbox  = $("#fos_user_registration_form_acceptedTerms"),
		$acceptedPersonalDataCheckbox  = $("#fos_user_registration_form_acceptedPersonalData"),
		$isAssociatedStyledCheckbox  = $("#isAssociatedStyledCheckbox"),
		$acceptedTermsStyledCheckbox  = $("#acceptedTermsStyledCheckbox"),
		$acceptedPersonalDataStyledCheckbox  = $("#acceptedPersonalDataStyledCheckbox"),
		$termsErrorContainer = $("#termsErrorContainer"),

		// Player Dashboard
		$roulette = $("#roulette"),
		$roulettePNGPath = $roulette.attr("src"),
		$rouletteGIFPath = $roulette.attr("data-src"),
		hours = 0,
		$timeLeftContainer = $("#timeLeftContainer"),
		$timeLeft = $("#timeLeft"),
		$hoursMinsLeft = 0,
		$hoursLeft = 0,
		$minsLeft = 0,
		$playerScore = $("#playerScore"),

		// Random Questions
		$questionTitle = $("#questionTitle"),
		$questionAnswers = $("#questionAnswers"),
		$countDownContainer = $("#countDownContainer"),
		$rouletteBtnContainer = $("#rouletteBtnContainer"),
		// $shareContainer = $("#shareContainer"),
		answerId = "",
		loaderPath = "/img/gif/loader.gif",
		htmlLoader = "<p class='loader-container'><img src=" + loaderPath + " alt='Cargando...'></p>"
		;

	getUserInfo();

	$fosUserRegistrationForm.on("submit", function() {
		let empty = $(this).find("input").filter(function() {
			return this.value === "";
		});


		if (empty.length == 0) {
			if ($acceptedTermsCheckbox.attr("checked")) {
				$termsErrorContainer.addClass("hide");
				return true;
			} else {
				$termsErrorContainer.removeClass("hide");
				return false;
			}
		}

		return false;
	});

	// For styles checkboxes
	$isAssociatedCheckbox.attr("checked", false);
	$acceptedTermsCheckbox.attr("checked", false);
	$acceptedPersonalDataCheckbox.attr("checked", false);

	$isAssociatedStyledCheckbox.on("click", ".slider", function() {
		$isAssociatedCheckbox.attr("checked", !$isAssociatedCheckbox.attr("checked"));
	});

	$acceptedTermsStyledCheckbox.on("click", ".slider", function() {
		$acceptedTermsCheckbox.attr("checked", !$acceptedTermsCheckbox.attr("checked"));
	});

	$acceptedPersonalDataStyledCheckbox.on("click", ".slider", function() {
		$acceptedPersonalDataCheckbox.attr("checked", !$acceptedPersonalDataCheckbox.attr("checked"));
	});

	// Get User Info for Answered Questions and Last Login
	function getUserInfo() {
		$.ajax({
			url: "/userInfo",
			method: "post",
			data: {},
			type: "json",
			success: function(userInfo) {
				let lastLoginTime = 0,
					currentDate = new Date();

				userInfo = JSON.parse(userInfo);
				// Removing 7 hours for CEST vs Bogotá Time
				lastLoginTime = new Date(userInfo.lastLogin.date).getTime() - (7 * 60 * 60 * 1000);
				hours = Math.abs(currentDate.getTime() - lastLoginTime) / 3600000;

console.log(hours);
console.log(userInfo.answeredQuestions);

				$hoursMinsLeft = 24 - hours;
				$hoursLeft = parseInt($hoursMinsLeft);
				$minsLeft = $hoursMinsLeft - $hoursLeft;
				$minsLeft = $minsLeft * 60;

				if (userInfo.answeredQuestions > 2) {
					if (hours < 24) {
						$rouletteBtnContainer.html("");
						$questionTitle.html("<p>Ya respondiste las 3 preguntas de hoy.</p>");

						$timeLeft.html($hoursLeft + ":" + parseInt($minsLeft));
						$timeLeftContainer.removeClass("hide");
					} else {
						$rouletteBtnContainer.html("<img id='startStopRouletteBtn' data-static='true' data-loader='/img/gif/loader.gif' src='/img/btn-play.png' class='btn-play' alt='Jugar' width='200'>");
					}
				} else {
					$rouletteBtnContainer.html("<img id='startStopRouletteBtn' data-static='true' data-loader='/img/gif/loader.gif' src='/img/btn-play.png' class='btn-play' alt='Jugar' width='200'>");
				}
			},
			error: function(error) {
				console.error("An unhandled error occurred in ajax success callback: " + error);
			}
		});
	}

	function startRoulette() {
		$countDownContainer.html("<p class='count-down-container'>10</p>");
		randomQuestion(htmlLoader);
		$rouletteBtnContainer.html("");
	}

	// Random Questions
	function randomQuestion(htmlLoader) {
		$.ajax({
			url: "/randomQuestion",
			method: "post",
			data: {},
			type: "json",
			beforeSend: () => {
				$questionTitle.html(htmlLoader);
			},
			success: function(questions) {
				countDown();

				$.each(JSON.parse(questions), (index, question) => {
					$questionTitle.html("<p>" + question.title + "</p>");
					$questionAnswers.html(
						"<div class='col-xs-12 text-center answer-container'><span id='1' class='btn-roulette'>" + question.firstOption + "</span></div><div class='col-xs-12 text-center answer-container'><span id='2' class='btn-roulette'>" + question.secondOption + "</span></div><div class='col-xs-12 text-center answer-container'><span id='3' class='btn-roulette'>" + question.thirdOption + "</span></div>"
					);

					answerId = question.answer;
				});
			},
			error: function(error) {
				console.error("An unhandled error occurred in ajax success callback: " + error);
			}
		});
	}

	// Get the Count Down
	function countDown() {
		let i = 10;

		countDownInterval = setInterval(function() {
			if (i == 0) {
				$.ajax({
					url: "/notAnswered",
					method: "post",
					data: {},
					type: "json",
					success: function(data) {
						location.reload();
						// clearInterval(this);
						// $questionTitle.html("");
						// $questionAnswers.html("");
						// $countDownContainer.html("");
					},
					error: function(error) {
						console.error("An unhandled error occurred in ajax success callback: " + error);
					}
				});
			} else {
				$countDownContainer.html("<p class='count-down-container'>" + i-- + "</p>");
			}
		}, 1000);
	}

	// Answering Questions
	$questionAnswers.on("click", ".btn-roulette", function() {
		let $this = $(this),
			id = $this.attr("id"),
			correctAnswer = id == answerId,
			message = correctAnswer ? "¡Ganaste 10 Balones! <br> Continúa Jugando" : "¡Te comiste el gol! <br> Continúa Jugando";

		$.ajax({
			url: "/saveAnswer",
			method: "post",
			data: { correctAnswer : correctAnswer },
			type: "json",
			success: function(data) {
				if (JSON.parse(data).status == "block") {
					getUserInfo();
					$rouletteBtnContainer.html("");
					message = "Ya respondiste las 3 preguntas de hoy.";
				} else {
					$rouletteBtnContainer.html("<img id='startStopRouletteBtn' data-static='true' data-loader='/img/gif/loader.gif' src='/img/btn-play.png' class='btn-play' alt='Jugar' width='200'>");
				}

				$playerScore.html(JSON.parse(data).score);
			},
			error: function(error) {
				console.error("An unhandled error occurred in ajax success callback: " + error);
			}
		});

		clearInterval(countDownInterval);

		resetQuestion();
		$countDownContainer.html("");

		setTimeout(function(){
			$questionTitle.html("<p>" + message + "</p>");
		}, 1750);
	});

	function resetQuestion() {
		$questionTitle.html(htmlLoader);
		$questionAnswers.html("");
	}

	$buyModalBtn.on("click", function(e) {
		e.preventDefault();

		$buyModal.modal("show");
	});

	$termsModalTriggers.on("click", function(e) {
		e.preventDefault();

		$termsModal.modal("show");
	});

	$rankingModalBtn.on("click", function(e) {
		e.preventDefault();

		let $this = $(this),
			$url = $this.attr("data-url"),
			$htmlcontent = "",
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
});
