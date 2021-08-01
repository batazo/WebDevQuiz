//Globals
const version = "v10";
let answerareas;
let qinputs;

//Inits
renerQuestion();
verSpan.innerHTML = `(${version})`;

//Renders
async function renderEvaluation(answerareas) {
  answerareas.nextElementSibling.innerHTML = "";
  let qid = getAnswerareaDatasetQid(answerareas);
  let aids = getAnswerareaDatasetAids(answerareas);
  
  let data = await checkAnswer(qid, aids);
  let explan = data.explanation == undefined ? "Nem jelöltél ki választ" : data.explanation;
  let correct = data.correct ? "A válaszod helyes!" : "A válaszod sajnos helytelen!";
  let correctColor = data.correct ? "green" : "red";
  let whatCorrects = data.correctAnswers == undefined ? "" : data.correctAnswers;
  let whatCorrectString = "";
  if (whatCorrects) whatCorrectString = "A helyes válasz(ok):";
  for (let whatCorrect of whatCorrects) {
    whatCorrectString += " " + whatCorrect.answer;
  }
  let renderString = `
      <p><b style="color: ${correctColor}">${correct}</b> ${whatCorrectString}</p>
      <p>${explan}</p>
  `;
  answerareas.nextElementSibling.innerHTML += renderString;
  answerareas.nextElementSibling.classList.remove("hidden");
}

function renderAllEvaluation() {
  for (let answerarea of answerareas) {
    renderEvaluation(answerarea);
  }
}

async function renerQuestion() {
  questionDIV.innerHTML = "";
  let renderString = "";

  try {
    const randomQuestions = await getQuestion();
    let questionNumber = 0;

    for (question of randomQuestions) {
      let answerNumber = 0;
      questionNumber++;

      renderString += `
			<div id="question-${questionNumber}" class="questioninput">
				<h3 id="Q${questionNumber}"> ${questionNumber}. Kérdés: ${question.question}</h3>
        <div class="answerarea" id="answerarea-${questionNumber}" data-qid="${question.id}">`;
      for (answer of question.answers) {
        answerNumber++;
        renderString += `
          <input type="radio" name="Q${questionNumber}" id="Q${questionNumber}A${answerNumber}" data-aid="${answer.id}" />
					<label for="Q${questionNumber}A${answerNumber}">${answer.answer}</label>`;
      }
      renderString += `
      </div><!-- end of answerarea -->
        <div class="explanation hidden">
        </div>
        <hr>
			</div><!-- questioninput end -->`;
    }
  } catch (e) {
    renderString = `<p>SERVER ERROR  <button onclick="getQuestion()">REFRESH</button></p>`;
  }

  questionDIV.innerHTML = renderString;
  refreshSelectors();
}

//Helpers
function refreshSelectors() {
  answerareas = document.querySelectorAll("[data-qid]");
  qinputs = document.querySelectorAll(".questioninput");
}

function getAnswerareaDatasetQid(answerareas) {
  return answerareas.dataset.qid;
}

function getAnswerareaDatasetAids(answerareas) {
  let checkedAnswers = document.querySelectorAll(
    `#${answerareas.id} input:checked`
  );
  let selected = [];
  for (let checkedAnswer of checkedAnswers) {
    selected.push(checkedAnswer.dataset.aid);
  }
  return selected;
}

function getGoodAnswersFromData(fromdata){
  let goodAnswers = [];
  for(data of fromdata.correctAnswers){
    goodAnswers.push(data.id);
  }
  return goodAnswers;
}

function getGoodAnswersStringFromData(fromdata){
  let goodAnswers = "";
  for(data of fromdata.correctAnswers){
    goodAnswers += data.answer;
  }
  return goodAnswers;
}

//Data Queries
async function getQuestion() {
  const endpoint = "https://webdevquiz.mysqhost.ml:8090/api/questionlist/10";

  const response = await fetch(endpoint);
  const data = await response.json();
  console.log(data);
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
  console.log(data);
  return data;
}
