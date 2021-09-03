const application = { name: "Webmaster QUIZ", version: "v14B-React" };
const endpoints = {
  questionlist: "https://webdevquiz.mysqhost.ml:8090/api/questionlist/",
  answerchecker: "https://webdevquiz.mysqhost.ml:8090/api/check/" };


//React Components
const { useState, useEffect } = React;

function App() {
  const [data, setData] = useState([]);
  const [panelLoading, setPanelLoading] = useState(false);
  const [dataLoadingError, setDataLoadingError] = useState(false);
  const [evalutiondata, setEvalutionData] = useState([]);
  const [evaluted, setEvaluted] = useState(false);
  const [evalutionLoading, setEvalutionLoading] = useState(false);
  const [score, setScore] = useState(0);

  const panellimit = 10;
  const disableEvalutionAlert = false;

  const refreshQuestions = async () => {
    setQuestions(setData, setDataLoadingError, setPanelLoading, panellimit);
    setEvaluted(false);
    setScore(0);
  };

  const newQuestions = async () => {
    alertify.
    confirm(
    "Figyelmeztetés!",
    "Minden kérdés törlődni fog!",
    function () {
      alertify.success("Ok");
      refreshQuestions();
    },
    function () {
      alertify.error("Cancel");
    }).

    set("closable", false);
  };

  const evalution = async () => {
    window.scrollTo(0, 0);
    console.log("Evalution...");
    if (!checkAllAnswerAreaIsSelected() && !disableEvalutionAlert) {
      alertify.
      alert("Figyelmeztetés!", "Nincs minden kérdés megválaszolva", function () {
        //alertify.success("Ok");
      }).
      set("closable", false);
      return false;
    }

    setEvalutionLoading(true);

    let evaluted = await [...areaSelector().answerareas].map(
    async answerarea => {
      let qid = answerAreaDatas(answerarea).qid;
      let selectedaids = answerAreaDatas(answerarea).selectedaids;
      let evalutionResponse = await checkAnswer(qid, selectedaids);
      return await {
        evalutioncount: "disabled",
        qid: qid,
        ...(await evalutionResponse) };

    });



    Promise.all(evaluted).then(evalutedvalues => {
      setEvalutionData(evalutedvalues);
      setEvaluted(true);
      setScore(countTrueAnswers(evalutedvalues));
      console.log("Evaluted...");
      setEvalutionLoading(false);
    }).catch(error => {
      console.log('SOMETHING WRONG WITH EVALUTION ::: ' + error);
      alertify.
      alert("Figyelmeztetés!", "Valami hiba történt a kiértékelő szerver elérése során. <br> Kérjük próbálja meg később!", function () {
      });
      setEvalutionLoading(false);
    });
  };

  useEffect(async () => {
    console.clear();
    console.log("Page loaded...");
    setQuestions(setData, setDataLoadingError, setPanelLoading, panellimit);
  }, []);

  //console.log("App loading...");
  //console.log(evalutiondata.length);
  //console.log(score)

  const PanelsTemplate = data.map((paneldata, index) => {
    return (
      paneldata != null && /*#__PURE__*/
      React.createElement(Panel, {
        key: index,
        panelId: index,
        question: paneldata.question,
        qid: paneldata.id,
        answers: paneldata.answers,
        evalutiondata: evalutiondata,
        evaluted: evaluted }));



  });

  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(NavBar, { newQuestions: newQuestions, evalution: evalution }), /*#__PURE__*/
    React.createElement(Container, null,
    panelLoading && /*#__PURE__*/
    React.createElement(LoadingPanel, null, /*#__PURE__*/
    React.createElement("img", {
      "max-width": "300px",
      src: "https://raw.githubusercontent.com/bzozoo/WebDevQuiz/main/Frontend-1/img/load.gif" })),



    evalutionLoading && /*#__PURE__*/React.createElement(EvalutionInProgressPanel, null),
    dataLoadingError && /*#__PURE__*/
    React.createElement(ErrorPanel, null, "SERVER ERROR...", /*#__PURE__*/

    React.createElement("button", { onClick: refreshQuestions, id: "errorrefreshbutton" }, "REFRESH")), /*#__PURE__*/




    React.createElement("div", { id: "questionDIV" },
    data.length && /*#__PURE__*/
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(Header, { panellimit: panellimit, evaluted: evaluted, score: score }),
    PanelsTemplate)))));






}



function NavBar({ evalution, newQuestions }) {
  let dataDelay = "{ 'show': 500, 'hide': 100 }";
  let NavBarButton = (props) => /*#__PURE__*/
  React.createElement("button", {
    className: "btn",
    onClick: e => {props.getttedFunction();},
    type: "button",
    id: props.GettedId,
    "data-toggle": "tooltip",
    "data-placement": "left",
    "data-delay": dataDelay,
    title: props.gettedTitle },
  props.children, /*#__PURE__*/
  React.createElement("span", { className: "navbarbuttontext" }, " " + props.gettedTitle));



  return /*#__PURE__*/(
    React.createElement("div", { id: "navbar" }, /*#__PURE__*/
    React.createElement("div", { id: "logo" }, /*#__PURE__*/
    React.createElement("span", {
      className: "largest",
      title: application.name + " - " + application.version },

    application.name)), /*#__PURE__*/


    React.createElement("div", { id: "navbarbuttons" }, /*#__PURE__*/
    React.createElement(NavBarButton, {
      getttedFunction: evalution,
      propsGettedId: "evalutebutton",
      gettedTitle: "KI\xC9RT\xC9KEL" }, /*#__PURE__*/

    React.createElement("i", { class: "fas fa-check-circle" })), /*#__PURE__*/

    React.createElement(NavBarButton, {
      getttedFunction: newQuestions,
      propsGettedId: "newquestions",
      gettedTitle: "\xDAJ K\xC9RD\xC9SEK" }, /*#__PURE__*/

    React.createElement("i", { class: "fas fa-sync" })))));




}

function Container(props) {
  //console.log("Container rendering ...");
  return /*#__PURE__*/React.createElement("div", { id: "container" }, props.children);
}

function LoadingPanel(props) {
  return /*#__PURE__*/(
    React.createElement("div", { className: "panel load", id: "panel_loading" },
    props.children));


}

function EvalutionInProgressPanel() {
  return /*#__PURE__*/(
    React.createElement("div", { className: "panel evalutionprogress", id: "panel_evalutionloading" }, "A ki\xE9rt\xE9kel\xE9s folyamatban van, k\xE9rem v\xE1rjon..."));



}

function ErrorPanel(props) {
  return /*#__PURE__*/(
    React.createElement("div", { className: "panel error", id: "error_panel" },
    props.children));


}

function Header({ panellimit, evaluted, score }) {
  let flexclass = evaluted ? " flexedpanel" : "";
  return /*#__PURE__*/(
    React.createElement("header", null, /*#__PURE__*/
    React.createElement("div", { className: "panel" + flexclass, id: "containerheader" }, /*#__PURE__*/
    React.createElement("div", { id: "qheader" }, /*#__PURE__*/
    React.createElement("h1", null, "K\xC9RD\xC9SEK"), " (", panellimit, " k\xE9rd\xE9s)"),

    evaluted && /*#__PURE__*/
    React.createElement("div", { id: "scorepanel" }, /*#__PURE__*/
    React.createElement("p", null, "Helyes v\xE1laszok: ",
    score, " / ", panellimit), /*#__PURE__*/

    React.createElement("p", null, "A pontjaid sz\xE1ma: ", score, " PONT"), /*#__PURE__*/
    React.createElement("p", null, "A sz\xE1zal\xE9kos \xE9rt\xE9kel\xE9s: ", score / 10 * 100, "%")))));





}

function Panel({ panelId, qid, question, answers, evalutiondata, evaluted }) {
  //console.log(evalutiondata.length)
  return /*#__PURE__*/(
    React.createElement("div", {
      className: "panel questioninput",
      id: "question-" + panelId,
      "data-panel-qid": qid }, /*#__PURE__*/

    React.createElement("h3", { id: "Q" + panelId },
    panelId + 1, ". K\xE9rd\xE9s:", " ", /*#__PURE__*/
    React.createElement("span", { dangerouslySetInnerHTML: { __html: question } })),

    findQuestionByQid(qid) != undefined && /*#__PURE__*/React.createElement(PanelDescription, { qid: qid }), /*#__PURE__*/
    React.createElement(AnswerArea, { panelId: panelId, qid: qid, answers: answers }),
    evaluted && /*#__PURE__*/
    React.createElement(EvalutionPanel, {
      calculatedEvalutionDatas: evalutionTemplateCalculator(
      panelId,
      evalutiondata) }),



    findQuestionByQid(qid) != undefined && /*#__PURE__*/React.createElement(TagContainer, { qid: qid })));


}

function TagContainer({ qid }) {

  let TagItems = findQuestionByQid(qid).tag != undefined ? findQuestionByQid(qid).tag.map(tag => /*#__PURE__*/React.createElement("div", { class: "tag__item" }, tag)) : "";

  return /*#__PURE__*/React.createElement("div", { class: "tagcontainer" },
  TagItems);

}

function PanelDescription({ qid }) {
  return /*#__PURE__*/React.createElement("div", { className: "descriptionarea" },
  findQuestionByQid(qid).qDescription, /*#__PURE__*/React.createElement("br", null),
  findQuestionByQid(qid).qCodepenCode != "" && /*#__PURE__*/React.createElement(CodePenCode, { codepencode: findQuestionByQid(qid).qCodepenCode }));

}

function CodePenCode({ codepencode }) {
  useEffect(async () => {

    console.log("CODEPEN CODE...");

    const script = document.createElement("script");

    script.src = "https://assets.codepen.io/assets/embed/ei.js";
    script.async = true;

    document.body.appendChild(script);

  }, []);



  return /*#__PURE__*/React.createElement("div", { class: "codepenembedded" }, /*#__PURE__*/React.createElement("p", { "data-height": "90", "data-theme-id": "24311", "data-slug-hash": codepencode, "data-default-tab": "js", "data-user": "triss90", "data-embed-version": "2", class: "codepen" }));

}

function AnswerArea({ panelId, qid, answers }) {
  //console.log("AnswerArea template: ");
  //console.log(props);
  let answerCounter = 0;
  let aids = Object.values(answers).map(a => a.id);

  let answerTemplate = answers.map((answer) => /*#__PURE__*/
  React.createElement(Answer, { panelId: panelId, answer: answer, answerCount: answerCounter++ }));


  return /*#__PURE__*/(
    React.createElement("div", {
      class: "answerarea",
      id: "answerarea-" + panelId,
      "data-qid": qid,
      "data-aids": aids },

    answerTemplate));


}

function Answer({ panelId, answer, answerCount }) {
  //console.log("Answer template: ");
  //console.log(answerCount);
  const answerInputId = "Q" + panelId + "A" + answerCount;
  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("input", {
      type: "radio",
      name: "Q" + panelId,
      id: answerInputId,
      "data-aid": answer.id }), /*#__PURE__*/

    React.createElement("label", { for: answerInputId }, answer.answer)));


}

function evalutionTemplateCalculator(panelId, evalutiondata) {
  let correctChk;
  let colorclass;
  let goodAnswers;
  if (evalutiondata[panelId]) {
    correctChk =
    evalutiondata[panelId].correct === true ?
    "A VÁLASZ HELYES" :
    "A VÁLASZ HELYTELEN";
    colorclass =
    evalutiondata[panelId].correct === true ? "success" : "unsuccessful";
    goodAnswers = evalutiondata[panelId].correctAnswers.
    map(correctAnswer => correctAnswer.answer).
    join(", ");
    let explanation = evalutiondata[panelId].explanation;

    return { panelId, correctChk, colorclass, goodAnswers, explanation };
  }
}

function EvalutionPanel({ calculatedEvalutionDatas }) {
  const {
    panelId,
    correctChk,
    colorclass,
    goodAnswers,
    explanation } =
  calculatedEvalutionDatas;
  return /*#__PURE__*/(
    React.createElement("div", { id: "evalutionpanel_" + panelId, className: "explanation " + colorclass }, /*#__PURE__*/
    React.createElement("p", { "data-chksuccess": "correct" }, /*#__PURE__*/
    React.createElement("b", null, " ", correctChk, " !")), "A helyes v\xE1lasz(ok): ",

    goodAnswers, ";", /*#__PURE__*/React.createElement("p", null, explanation)));


}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), root);
//React Components END

//Global functs
//Data Queries
async function getQuestion(questionlimit) {
  const endpoint = endpoints.questionlist + questionlimit;
  let controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  let signal = controller.signal;

  const response = await fetch(endpoint, { signal });
  return await response.json();
}

async function checkAnswer(qid, selectedaids) {
  const endpoint = endpoints.answerchecker;

  const bodyData = {
    questionId: qid,
    selectedAnswerIds: selectedaids };


  let controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  let signal = controller.signal;

  const options = {
    signal,
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json" },

    body: JSON.stringify(bodyData) };

  const response = await fetch(endpoint, options);
  const data = await response.json();
  return await data;
}

//Helpers
function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

async function setQuestions(
setData,
setDataLoadingError,
setPanelLoading,
panellimit)
{
  setDataLoadingError(false);
  try {
    console.log("Set Questions start...");
    setData([]);
    setPanelLoading(true);
    let fetchedData = await getQuestion(panellimit);
    setData(fetchedData);
    console.log("Question Datas updated...");
  } catch (error) {
    console.log("Error in fetch..." + error);
    setDataLoadingError(true);
  } finally {
    setPanelLoading(false);
  }
}

function areaSelector() {
  let answerareas = document.querySelectorAll(".answerarea");
  let qinputs = document.querySelectorAll(".questioninput");
  return { answerareas, qinputs };
}

function getAllAnswerAreaData() {
  return [...areaSelector().answerareas].map((answar) =>
  answerAreaDatas(answar));

}

function answerAreaDatas(answerareasN) {
  let answerareaBody = answerareasN;
  let qid = getAnswerareaDatasetQid(answerareasN);
  let aids = getAidsFromAnswerArea(answerareasN);
  let selectedaids = getSelectedsInAnswerArea(answerareasN);
  return { qid, aids, selectedaids, answerareaBody };
}

function getAnswerareaDatasetQid(answerareasN) {
  return answerareasN.dataset.qid;
}

function getSelectedsInAnswerArea(answerareasN) {
  return [...document.querySelectorAll(`#${answerareasN.id} input:checked`)].map(
  answerarea => answerarea.dataset.aid);

}

function getAidsFromAnswerArea(answerareasN) {
  return answerareasN.dataset.aids.split(",");
}

function getGoodAnswersFromData(fromdata) {
  let goodAnswers = [];
  for (let data of fromdata.correctAnswers) {
    goodAnswers.push(data.id);
  }
  return goodAnswers;
}

function checkAllAnswerAreaIsSelected() {
  return ![...getAllAnswerAreaData()].
  map(answerarea => answerarea.selectedaids.length).
  includes(0);
}

function countTrueAnswers(evalutiondata) {
  const counts = {};

  for (const num of evalutiondata.map(eval => eval.correct)) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  let countResult = counts[true] === undefined ? 0 : counts[true];

  return countResult;
}

function fastSelectAnswers() {
  [...areaSelector().answerareas].map(
  answerarea => answerarea.children[0].checked = true);

}
//Global functs END

//jQuery ToolTip
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip('hide');
  $('[data-toggle="tooltip').on('click', function () {
    $(this).tooltip('hide');
  });
});
//jQuery ToolTip END


//if (!mobileConsole.status.initialized) {
//mobileConsole.init();
//}
