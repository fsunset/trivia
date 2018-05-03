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
		hours = 0,

		// Random Questions
		$questionTitle = $("#questionTitle"),
		$questionAnswers = $("#questionAnswers"),
		$countDownContainer = $("#countDownContainer"),
		$rouletteBtnContainer = $("#rouletteBtnContainer"),
		$shareContainer = $("#shareContainer"),
		answerId = "",
		loaderPath = "/img/gif/loader.gif",
		htmlLoader = "<p class='loader-container'><img src=" + loaderPath + " alt='Cargando...'></p>"
		;

	getUserInfo();

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

console.log('hours: ' + hours);
console.log('answeredQuestions: ' + userInfo.answeredQuestions);

				if (userInfo.answeredQuestions > 2) {
					if (hours < 24) {
						$rouletteBtnContainer.html('');
						$questionTitle.html("<p>Ya respondiste las 3 pregunta de hoy, ¡en 24 horas podrás seguir ganando!</p>");
					} else {
// ********
// INSERT HERE THE CODE FOR NEW VALUE FOR Answered Questions!!
// ********
						$rouletteBtnContainer.html('<span id="startStopRouletteBtn" data-static="true" data-loader="/img/gif/loader.gif" class="btn-roulette btn-roulette-yellow"> Jugar </span>');
					}
				} else {
					$rouletteBtnContainer.html('<span id="startStopRouletteBtn" data-static="true" data-loader="/img/gif/loader.gif" class="btn-roulette btn-roulette-yellow"> Jugar </span>');
				}
			},
			error: function(error) {
				console.error("An unhandled error occurred in ajax success callback: " + error);
			}
		});
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

				$shareContainer.append('<div id="changeQuestion" class="col-xs-5 col-sm-4 col-sm-offset-2 text-center"> Cambiar Pregunta </div>');
			},
			error: function(error) {
				console.error("An unhandled error occurred in ajax success callback: " + error);
			}
		});
	}

	// Get the Count Down
	function countDown() {
    	var i = 10;
    	countDownInterval = setInterval(function() {
	        if (i == 0) clearInterval(this);
	        else $countDownContainer.html("<p class='count-down-container'>" + i-- + "</p>");
	    }, 1000);
	}

	// Answering Questions
	$questionAnswers.on("click", ".btn-roulette", function() {
		let $this = $(this),
			id = $this.attr("id"),
			message = id == answerId ? "¡Ganaste 5 Balones! <br> Continua Jugando" : "Continua Jugando";

		$.ajax({
			url: "/saveAnswer",
			method: "post",
			data: {},
			type: "json",
			success: function(data) {
				if (JSON.parse(data).status == "block") {
					$rouletteBtnContainer.html("");
					message = "Ya respondiste las 3 pregunta de hoy, ¡en 24 horas podrás seguir ganando!";
				} else {
					$rouletteBtnContainer.html('<span id="startStopRouletteBtn" data-static="true" data-loader="' + loaderPath + '" class="btn-roulette btn-roulette-yellow"> Jugar </span>');
				}
			},
			error: function(error) {
				console.error("An unhandled error occurred in ajax success callback: " + error);
			}
		});

		clearInterval(countDownInterval);
		$countDownContainer.html(" ");

		resetQuestion();

		setTimeout(function(){
			$questionTitle.html("<p>" + message + "</p>");
		}, 1750);
	});

	function resetQuestion() {
		$questionTitle.html(htmlLoader);
		$questionAnswers.html('');
		$("#changeQuestion").remove();
	}

	$rouletteBtnContainer.on("click", "#startStopRouletteBtn", function() {
		let $this = $(this);

		if ($this.attr('data-static')) {
			$roulette
				.attr("style", "width:326px!important; margin-top:78px; margin-bottom:63px")
				.attr("src", $rouletteGIFPath);

			$this
				.removeAttr('data-static')
				.text('Detener');

			resetQuestion();
		} else {
			$roulette
				.attr("style", " ")
				.attr("src", $roulettePNGPath);

			$this
				.attr('data-static', true)
				.text('Jugar');

			$countDownContainer.html('<p class="count-down-container">10</p>');
			randomQuestion(htmlLoader);
			$rouletteBtnContainer.html('');
		}
	});

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
