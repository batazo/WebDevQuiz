
//Globals
const version = "v18B";
let answerareas;
let questionlimit = 10;
let qinputs;

//Inits
renerAllQuestions();
verSpan.innerHTML = `(${version})`;

//Renders
//Question renders
async function renerAllQuestions() {
	questionDIV.innerHTML = "";
	let renderString = "";
	let questions = await getQuestionList();
	if (!questions) {
		renderString += `<p>SERVER ERROR  <button onclick="renerAllQuestions()">REFRESH</button></p>`;
		questionDIV.innerHTML += renderString;
	} else {
		renderString = questions.map(async (question) => {
			const questionBlock = await templeteForQuestions(question);
			return questionBlock;
		});
		renderString = await Promise.all(renderString);
		questionDIV.innerHTML = renderString.join("");
		refreshSelectors();
	}
}

//Evaluation renders
async function renderEvaluation(answerareasN) {
	answerareasN.nextElementSibling.innerHTML = "";
	let renderString = await templateForEvalution(answerareasN);
	answerareasN.nextElementSibling.innerHTML += renderString;
	answerareasN.nextElementSibling.classList.remove("hidden");
}

async function renderAllEvaluation() {
	return [...answerareas].map(async (answerarea) => {
		await renderEvaluation(answerarea);
	});
}

//Score renders
async function renderScore() {
	console.log("SCORE RENDER START...");
	let renderString = await templateForScore();
	result.innerHTML = await renderString;
}

//Templates amd TemplateVars
//Questions Templs
function templeteForQuestions(data) {
	const tempVars = {
		questionId: data.id,
		questionNumber: data.qnumber,
		question: data.question,
		answerAreaHTML: templateForAllAnswerBoxes(data.answers, data.qnumber),
		default: "OK"
	};

	const templateMask = function () {
		return `
			<div id="question-${tempVars.questionNumber}" class="questioninput">
				<h3 id="Q${tempVars.questionNumber}"> ${tempVars.questionNumber}. Kérdés: ${tempVars.question}</h3>
  		<div class="answerarea" id="answerarea-${tempVars.questionNumber}" data-qid="${tempVars.questionId}">
					${tempVars.answerAreaHTML}
			</div><!-- end of answerarea -->
  		<div id="explanOf${tempVars.questionNumber}_${tempVars.questionId}" class="explanation hidden"></div>
        <hr>
			</div><!-- questioninput end -->
			`;
	};

	return templateMask();
}

//Answers Templs
function templateForAllAnswerBoxes(answers, qNumber) {
	const templateMask = function () {
		return `
					${this.answerboxes}	   
			`;
	};

	let allansverboxHTML = "";
	for (let answer of answers) {
		allansverboxHTML += templateForAnswerBox(answer, qNumber);
	}

	const templateVars = {
		answerboxes: allansverboxHTML
	};

	const fullTemplate = templateMask.bind(templateVars)();

	return fullTemplate;
}

function templateForAnswerBox(answer, qNumber) {
	const templateMask = function () {
		return `
			          <input type="radio" name="Q${this.questionNumber}" id="Q${this.questionNumber}A${this.answerNumber}" data-aid="${this.answerId}" />
					<label for="Q${this.questionNumber}A${this.answerNumber}">${this.answerString}</label>
			`;
	};

	const templateVars = {
		questionNumber: qNumber,
		answerNumber: answer.anumber,
		answerId: answer.id,
		answerString: answer.answer
	};

	const fullTemplate = templateMask.bind(templateVars)();

	return fullTemplate;
}

//Evalution Templs
async function templateForEvalution(answerareasN) {
	const templateMask = function () {
		return `
					<p data-chksuccess="${this.success}"><b style="color: ${this.correctColor}">${this.correct}</b>
					${this.whatCorrectString}
					</p>
      		<p>${this.explan}</p>			   
			`;
	};

	let data = await checkAnswerByAnswerarea(answerareasN);
	let explan =
		data.explanation == undefined ? "Nem jelöltél ki választ" : data.explanation;
	let correct = data.correct
		? "A válaszod helyes!"
		: "A válaszod sajnos helytelen!";
	let correctColor = data.correct ? "green" : "red";
	let success = data.correct ? true : false;
	let whatCorrects = data.correctAnswers == undefined ? "" : data.correctAnswers;
	let whatCorrectString = whatCorrects ? getGoodAnswersStringFromData(data) : "";

	const templateVars = {
		explan: explan,
		correct: correct,
		success: success,
		correctColor: correctColor,
		whatCorrectString: whatCorrectString
	};

	const fullTemplate = templateMask.bind(templateVars)();

	return fullTemplate;
}

//Score Templs
function templateForScore() {
	const templateMask = function () {
		return `
			    A pontjaid száma: ${this.score} (${this.scorePercent} %)
			`;
	};

		let goodAnswers = document.querySelectorAll(
		`.explanation p[data-chksuccess="true"] `
	).length;
	
	const templateVars = {
		score: goodAnswers,
		scorePercent: goodAnswers / (questionlimit / 100)		
	};

	const fullTemplate = templateMask.bind(templateVars)();

	return fullTemplate;
}

//Controllers
async function getQuestionList() {
	try {
		const questions = await getQuestion();
		let questionNumber = 1;
		let answerNumber = 0;

		for (let question of questions) {
			question.qnumber = questionNumber++;
			for (let answer of question.answers) {
				answer.anumber = answerNumber++;
			}
		}

		return questions;
	} catch (e) {
		console.log(e);
		return false;
	}
}

function getAnswerareaDatasetQid(answerareasN) {
	return answerareasN.dataset.qid;
}

function getAnswerareaSelectedDatasetAids(answerareasN) {
	let checkedAnswers = document.querySelectorAll(
		`#${answerareasN.id} input:checked`
	);
	let selected = [];
	for (let checkedAnswer of checkedAnswers) {
		selected.push(checkedAnswer.dataset.aid);
	}
	return selected;
}

function getAnswerareaAllDatasetAids(answerareasN) {
	let answersInArea = document.querySelectorAll(`#${answerareasN.id} input`);
	let answerareaAids = [];
	for (let answerInArea of answersInArea) {
		answerareaAids.push(answerInArea.dataset.aid);
	}
	return answerareaAids;
}

function getGoodAnswersFromData(fromdata) {
	let goodAnswers = [];
	for (let data of fromdata.correctAnswers) {
		goodAnswers.push(data.id);
	}
	return goodAnswers;
}

function getGoodAnswersStringFromData(fromdata) {
	let goodAnswers = "A helyes válasz(ok): ";
	for (let data of fromdata.correctAnswers) {
		goodAnswers += data.answer;
	}
	return goodAnswers;
}

async function checkAnswerByAnswerarea(answerareasN) {
	let qid = getAnswerareaDatasetQid(answerareasN);
	let aids = getAnswerareaSelectedDatasetAids(answerareasN);
	return await checkAnswer(qid, aids);
}

//Data Queries
async function getQuestion() {
	const endpoint =
		"https://webdevquiz.mysqhost.ml:8090/api/questionlist/" + questionlimit;
	const response = await fetch(endpoint);
	const data = await response.json();
	return data;
}

async function checkAnswer(qid, aids) {
	const endpoint = "https://webdevquiz.mysqhost.ml:8090/api/check/";

	const bodyData = {
		questionId: qid,
		selectedAnswerIds: aids
	};

	const options = {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(bodyData)
	};
	const response = await fetch(endpoint, options);
	const data = await response.json();
	return data;
}

//Helpers
function refreshSelectors() {
	answerareas = document.querySelectorAll("[data-qid]");
	qinputs = document.querySelectorAll(".questioninput");
}

//Evnent handlers
async function runEvaluation() {
	result.innerHTML = "Scores loading....";
	result.classList.remove("hidden");
	window.scrollTo(0, 0);

	let rendered = await renderAllEvaluation();
	
	Promise.allSettled(rendered)
		.then((res) => {
				renderScore();
		})
		.catch((err) => {
			console.log("AZ" + err);
		});
}
