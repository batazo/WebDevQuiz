const application = { name: "Webmaster QUIZ", version: "v14-React" };
const endpoints = {
	questionlist: "https://webdevquiz.mysqhost.ml:8090/api/questionlist/",
	answerchecker: "https://webdevquiz.mysqhost.ml:8090/api/check/"
};

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
		alertify
			.confirm(
				"Figyelmeztetés!",
				"Minden kérdés törlődni fog!",
				function () {
					alertify.success("Ok");
					refreshQuestions();
				},
				function () {
					alertify.error("Cancel");
				}
			)
			.set("closable", false);
	};
	
	const evalution = async () => {
		window.scrollTo(0, 0);
		console.log("Evalution...");
		if (!checkAllAnswerAreaIsSelected() && !disableEvalutionAlert) {
			alertify
				.alert("Figyelmeztetés!", "Nincs minden kérdés megválaszolva", function () {
					//alertify.success("Ok");
				})
				.set("closable", false);
			return false;
		}
		
		setEvalutionLoading(true);

		let evaluted = await [...areaSelector().answerareas].map(
			async (answerarea) => {
				let qid = answerAreaDatas(answerarea).qid;
				let selectedaids = answerAreaDatas(answerarea).selectedaids;
				let evalutionResponse = await checkAnswer(qid, selectedaids);
				return await {
					evalutioncount: "disabled",
					qid: qid,
					...(await evalutionResponse)
				};
			}
		);
		
			
		Promise.all(evaluted).then((evalutedvalues) => {
			setEvalutionData(evalutedvalues);
			setEvaluted(true);
			setScore(countTrueAnswers(evalutedvalues));
			console.log("Evaluted...");
			setEvalutionLoading(false);
		}).catch((error)=> {
			console.log('SOMETHING WRONG WITH EVALUTION ::: ' + error)
			alertify
				.alert("Figyelmeztetés!", "Valami hiba történt a kiértékelő szerver elérése során. <br> Kérjük próbálja meg később!", function () {
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
			paneldata != null && (
				<Panel
					key={index}
					panelId={index}
					question={paneldata.question}
					qid={paneldata.id}
					answers={paneldata.answers}
					evalutiondata={evalutiondata}
					evaluted={evaluted}
				/>
			)
		);
	});

	return (
		<>
			<NavBar newQuestions={newQuestions} evalution={evalution} />
			<Container>
				{panelLoading && (
					<LoadingPanel>
						<img
							max-width="300px"
							src="https://raw.githubusercontent.com/bzozoo/WebDevQuiz/main/Frontend-1/img/load.gif"
						/>
					</LoadingPanel>
				)}
				{evalutionLoading && <EvalutionInProgressPanel></EvalutionInProgressPanel>}
				{dataLoadingError && (
					<ErrorPanel>
						SERVER ERROR...
						<button onClick={refreshQuestions} id="errorrefreshbutton">
							REFRESH
						</button>
					</ErrorPanel>
				)}
				<div id="questionDIV">
					{data.length && (
						<>
							<Header panellimit={panellimit} evaluted={evaluted} score={score} />
							{PanelsTemplate}
						</>
					)}
				</div>
			</Container>
		</>
	);
}



function NavBar({ evalution, newQuestions }) {
	let dataDelay = "{ 'show': 500, 'hide': 100 }";
	let NavBarButton = (props) => (
			<button
					className="btn"
					onClick={(e) => { props.getttedFunction();  }}
					type="button"
					id={props.GettedId}
					data-toggle="tooltip"
					data-placement="left"
					data-delay={dataDelay}
					title={props.gettedTitle}>
    					{props.children}
						<span className="navbarbuttontext">{" " + props.gettedTitle}</span>
  			</button>
	);
	
	return (
		<div id="navbar">
			<div id="logo">
				<span
					className="largest"
					title={application.name + " - " + application.version}
				>
					{application.name}
				</span>
			</div>
			<div id="navbarbuttons">
				<NavBarButton
					getttedFunction={evalution}
					propsGettedId="evalutebutton"
					gettedTitle="KIÉRTÉKEL"
				>
					<i class="fas fa-check-circle"></i>
				</NavBarButton>
				<NavBarButton
					getttedFunction={newQuestions}
					propsGettedId="newquestions"
					gettedTitle="ÚJ KÉRDÉSEK"
				>
					<i class="fas fa-sync"></i>
				</NavBarButton>
			</div>
		</div>
	);
}

function Container(props) {
	//console.log("Container rendering ...");
	return <div id="container">{props.children}</div>;
}

function LoadingPanel(props) {
	return (
		<div className="panel load" id="panel_loading">
			{props.children}
		</div>
	);
}

function EvalutionInProgressPanel(){
		return (
		<div className="panel evalutionprogress" id="panel_evalutionloading">
			A kiértékelés folyamatban van, kérem várjon...
		</div>
	);
}

function ErrorPanel(props) {
	return (
		<div className="panel error" id="error_panel">
			{props.children}
		</div>
	);
}

function Header({ panellimit, evaluted, score }) {
	let flexclass = evaluted ? " flexedpanel" : "";
	return (
		<header>
			<div className={"panel" + flexclass} id="containerheader">
				<div id="qheader">
					<h1>KÉRDÉSEK</h1> ({panellimit} kérdés)
				</div>
				{evaluted && (
					<div id="scorepanel">
						<p>
							Helyes válaszok: {score} / {panellimit}
						</p>
						<p>A pontjaid száma: {score} PONT</p>
						<p>A százalékos értékelés: {(score / 10) * 100}%</p>
					</div>
				)}
			</div>
		</header>
	);
}

function Panel({ panelId, qid, question, answers, evalutiondata, evaluted }) {
	//console.log(evalutiondata.length)
	return (
		<div
			className="panel questioninput"
			id={"question-" + panelId}
			data-panel-qid={qid}
		>
			<h3 id={"Q" + panelId}>
				{panelId + 1}. Kérdés:{" "}
				<span dangerouslySetInnerHTML={{ __html: question }}></span>
			</h3>
			{(findQuestionByQid(qid) != undefined) && <PanelDescription qid={qid} /> }
			<AnswerArea panelId={panelId} qid={qid} answers={answers} />
			{evaluted && (
				<EvalutionPanel
					calculatedEvalutionDatas={evalutionTemplateCalculator(
						panelId,
						evalutiondata
					)}
				/>
			)}
			{(findQuestionByQid(qid) != undefined) && <TagContainer qid={qid} />}
		</div>
	);
}

function TagContainer({qid}){
	
	let TagItems = (findQuestionByQid(qid).tag != undefined)? findQuestionByQid(qid).tag.map((tag)=> <div class="tag__item">{tag}</div>) : "";
	
	return <div class="tagcontainer">
					{TagItems}
			</div>
}

function PanelDescription({qid}){
	return <div className="descriptionarea">
					{findQuestionByQid(qid).qDescription}<br />
					{findQuestionByQid(qid).qCodepenCode != "" && <CodePenCode codepencode={findQuestionByQid(qid).qCodepenCode} />}
				</div>;
}

function CodePenCode({codepencode}){
	useEffect(async () => {
		
		console.log("CODEPEN CODE...");
		
		    const script = document.createElement("script");

    script.src = "https://assets.codepen.io/assets/embed/ei.js";
    script.async = true;

    document.body.appendChild(script);
		
	}, []);
	
	
	
	return <div class="codepenembedded"><p data-height="90" data-theme-id="24311" data-slug-hash={codepencode} data-default-tab="js" data-user="triss90" data-embed-version="2" class="codepen"></p>
			</div>
}

function AnswerArea({ panelId, qid, answers }) {
	//console.log("AnswerArea template: ");
	//console.log(props);
	let answerCounter = 0;
	let aids = Object.values(answers).map((a) => a.id);

	let answerTemplate = answers.map((answer) => (
		<Answer panelId={panelId} answer={answer} answerCount={answerCounter++} />
	));

	return (
		<div
			class="answerarea"
			id={"answerarea-" + panelId}
			data-qid={qid}
			data-aids={aids}
		>
			{answerTemplate}
		</div>
	);
}

function Answer({ panelId, answer, answerCount }) {
	//console.log("Answer template: ");
	//console.log(answerCount);
	const answerInputId = "Q" + panelId + "A" + answerCount;
	return (
		<>
			<input
				type="radio"
				name={"Q" + panelId}
				id={answerInputId}
				data-aid={answer.id}
			/>
			<label for={answerInputId}>{answer.answer}</label>
		</>
	);
}

function evalutionTemplateCalculator(panelId, evalutiondata) {
	let correctChk;
	let colorclass;
	let goodAnswers;
	if (evalutiondata[panelId]) {
		correctChk =
			evalutiondata[panelId].correct === true
				? "A VÁLASZ HELYES"
				: "A VÁLASZ HELYTELEN";
		colorclass =
			evalutiondata[panelId].correct === true ? "success" : "unsuccessful";
		goodAnswers = evalutiondata[panelId].correctAnswers
			.map((correctAnswer) => correctAnswer.answer)
			.join(", ");
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
		explanation
	} = calculatedEvalutionDatas;
	return (
		<div id={"evalutionpanel_" + panelId} className={"explanation " + colorclass}>
			<p data-chksuccess="correct">
				<b> {correctChk} !</b>
			</p>
			A helyes válasz(ok): {goodAnswers};<p>{explanation}</p>
		</div>
	);
}

ReactDOM.render(<App />, root);
//React Components END

//Global functs
//Data Queries
async function getQuestion(questionlimit) {
	const endpoint = endpoints.questionlist + questionlimit;
	let controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 15000)
	let signal = controller.signal;

	const response = await fetch(endpoint, { signal });
	return await response.json();
}

async function checkAnswer(qid, selectedaids) {
	const endpoint = endpoints.answerchecker;

	const bodyData = {
		questionId: qid,
		selectedAnswerIds: selectedaids
	};
	
	let controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 15000)
	let signal = controller.signal;

	const options = {
		signal,
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(bodyData)
	};
	const response = await fetch(endpoint, options);
	const data = await response.json();
	return await data;
}

//Helpers
function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"))
    }, ms)
    promise.then(resolve, reject)
  })
}

async function setQuestions(
	setData,
	setDataLoadingError,
	setPanelLoading,
	panellimit
) {
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
		answerAreaDatas(answar)
	);
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
		(answerarea) => answerarea.dataset.aid
	);
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
	return ![...getAllAnswerAreaData()]
		.map((answerarea) => answerarea.selectedaids.length)
		.includes(0);
}

function countTrueAnswers(evalutiondata) {
	const counts = {};
	
	for (const num of evalutiondata.map((eval) => eval.correct)) {
		counts[num] = counts[num] ? counts[num] + 1 : 1;
	}
	
	let countResult = (counts[true] === undefined)? 0 : counts[true];
	
	return countResult;
}

function fastSelectAnswers() {
	[...areaSelector().answerareas].map(
		(answerarea) => (answerarea.children[0].checked = true)
	);
}
//Global functs END

//jQuery ToolTip
$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip('hide');
  $('[data-toggle="tooltip').on('click', function() {
    	$(this).tooltip('hide');
  });
});
//jQuery ToolTip END


//if (!mobileConsole.status.initialized) {
//mobileConsole.init();
//}
