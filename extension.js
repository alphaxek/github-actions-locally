const vscode = require('vscode');
const path = require('path');
const custom_act = require("./src/helpers/index");
const galApi = require("./src/api/index");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('github-actions-locally.gal', function () {
		// Create and show panel
		const panel = vscode.window.createWebviewPanel(
			'github-actions-locally',
			'Github Actions Locally',
			vscode.ViewColumn.One,
			{
				// Only allow the webview to access resources in our extension's media directory
				localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'img'))]
			}
		  );

		  const imgSummary = panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath,"img", "home.png")
		  ));

		  const imgCorrect = panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath,"img", "correct.png")
		  ));

		  const imgSuccess = panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath,"img", "success.png")
		  ));

		  const imgRemove = panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath,"img", "remove.png")
		  ));

		  const imgWaiting= panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath,"img", "waiting.png")
		  ));

		  const rocket= panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath,"img", "rocket.png")
		  ));

		  const imgLoading = panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath,"img", "loading.gif")
		  ));

		  const script = panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath,"scripts", "index.js")
		  ));

		  const style = panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath,"css", "style.css")
		  ));

		panel.webview.options = {
			enableScripts: true,
		};

		//run act functions
		// var s;
		// async function a() {
		// 	try {
		// 		s = await custom_act.getAllActions(vscode.workspace.workspaceFolders[0].uri['_fsPath']);
		// 	} catch (err) {
		// 		console.log("ACT: "+ err);
		// 	}
		// }
		// a();

		//console.log(custom_act.getAllActions(vscode.workspace.workspaceFolders[0].uri));
		const workflows = custom_act.getAllActions(vscode.workspace.workspaceFolders[0].uri['_fsPath']);

		var listOfWorkflows = [];

		for(const workflow in workflows['response']){
			listOfWorkflows[workflow] =  workflows['response'][workflow]['workflow_name'];
		}

		var listOfWorkflowsuSet = new Set(listOfWorkflows);

		var listOfWorkflowFilenames = [];

		for(const workflow in workflows['response']){
			listOfWorkflowFilenames[workflow] =  workflows['response'][workflow]['workflow_file'];
		}

		var listOfWorkflowFilenamesuSet = new Set(listOfWorkflowFilenames);

		var htmlWorkflow ="";
		
		for(const workflow in [...listOfWorkflowsuSet]){
			htmlWorkflow += `
			<div class="workflow" id="${[...listOfWorkflowFilenamesuSet][workflow]}" onClick="showJobs('${[...listOfWorkflowFilenamesuSet][workflow]}job','${[...listOfWorkflowFilenamesuSet][workflow]}')">
				<div class="active"></div>
				<p class="label">${[...listOfWorkflowsuSet][workflow]}</p>
			</div>`;
		}

		var htmlJob ="";
		// console.log(workflows);
		// for(const workflow in workflows['response']){
		// 	htmlJob += `
		// 	<div class="job" id="${workflows['response'][workflow]['workflow_file']}">
		// 		<img src="${imgWaiting}" class="status symbol"/>
	  	// 		<p class="label" onclick="runJob('${workflows['response'][workflow]['job_id']}')">${workflows['response'][workflow]['job_name']}</p>
  		// 	</div>`;
		// }
		var jobNum = 0;
		for(const workflow in workflows['response']){
			htmlJob += `
			<div class="step" id="${workflows['response'][workflow]['workflow_file']}job" onclick="showDetails('response${jobNum}')" style="display: none">
				<img src="${imgWaiting}" class="status symbol"/>
				<p class="label">${workflows['response'][workflow]['job_name']}</p>
				<p class="run" id="runJob">Run</p>
				<div class="detail" id="response${jobNum++}">
				<p><i>Ready to run</i></p>
				</div>
			</div>`;
		}

		

		//start API
		galApi.startAPI();

		// And set its HTML content
		panel.webview.html = getWebviewContent(imgSummary, imgCorrect, imgSuccess, imgRemove, imgWaiting, imgLoading, rocket, script, style, htmlWorkflow, htmlJob, vscode.workspace.workspaceFolders[0].uri['_fsPath'], "Build");
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(imgSummary, imgCorrect, imgSuccess, imgRemove, imgWaiting, imgLoading, rocket, script, style, htmlWorkflow, htmlJob, path, job) {
	return `<html lang="en">
	<head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <meta http-equiv="X-UA-Compatible" content="ie=edge">
	  <title>GAL</title>
	  <link rel="stylesheet" href="${style}">
	</head>
	<body>
	  <div class="container">
		  <div class="menu">
			  <h1 class="txtOne">GAL</h1>
			  <h3 class="txtTwo">All workflows</h3>
			  <div class="hr"></div>
			  ${htmlWorkflow}
			  <div class="hr"></div>
			  <div class="summary">
				  <div class="active"></div>
				  <p class="label"><img src="${imgSummary}" class="symbol"/>&nbsp;&nbsp;Summary</p>
			  </div>
			  <h3 class="txtTwo">Run Events</h3>
			  <div class="hr"></div>
			<!--$ { htmlJob } -->
			<div class="job" id="pull">
				<img src="${rocket}" class="status symbol"/>
	  			<p class="label" onclick="runJob(test')">Pull</p>
  		 	</div>
			<div class="job" id="push">
				<img src="${rocket}" class="status symbol"/>
	  			<p class="label" onclick="runJob(test')">Push</p>
  		 	</div>
			<div class="job" id="merge">
				<img src="${rocket}" class="status symbol"/>
				<p class="label" onclick="runJob(test')">Merge</p>
			</div>
		  </div>
		  <div class="main">
			  <button id="runJob">Run All Jobs</button>
			  <br>
			  <div class="info">
				  <h4>Docker Not Running</h4>
				  <div class="info-status">
					  <p class="txtThree">Status</p>
					  <p>-</p>
				  </div>
				  <div class="info-duration">
					  <p class="txtThree">Duration</p>
					  <p>-</p>
				  </div>
			  </div>
			  <div class="job-step">
				  <div class="job-status">
					  <p>Jobs</p>
					  <p class="txtThree">All</p>
				  </div>  
				  <div class="hr"></div>
				  <!--
				  <div class="step" onclick="showDetails('response')"   >
					  <img src="${imgCorrect}" class="status symbol"/>
					  <p class="label">Response</p>
					  <p class="duration">48s</p>
					  <div class="detail" id="response">
					  	<p><i>Waiting</i></p>
					  </div>
				  </div>
				  -->
				  ${htmlJob}
				  <!--
				  <div class="step" onclick="showDetails('step2')">
					  <img src="${imgLoading}" class="status symbol"/>
					  <p class="label">Step 2</p>
					  <p class="duration">236s</p>
					  <div class="detail">
						  <p id="response"><i>Waiting</i></p>
					  </div>
				  </div>
				  <div class="step" onclick="showDetails('step3')">
					  <img src="${imgWaiting}" class="status symbol"/>
					  <p class="label">Step 3</p>
					  <p class="duration"></p>
					  <div class="detail" id="step3">
						  <p id="response2"><i>Waiting</i></p>
					  </div>
				  </div>
				  <div class="step" onclick="showDetails('step4')">
					  <img src="${imgWaiting}" class="status symbol"/>
					  <p class="label">Step 4</p>
					  <p class="duration"></p>
					  <div class="detail" id="step4">
						  <p id="response3"><i>Waiting</i></p>
					  </div>
				  </div>
				  -->
			  </div>
		  </div>
	  </div>
	  <script src="${script}"></script>
	  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
	  <script>
		$(document).ready(function () {
			$("#runJob").click(function (e) {
				$.ajax({
					type: "GET",
					url: "http://localhost:7867/runworkflow?job=${job}&path=${encodeURI(path)}",
					dataType: "json",
					success: function (result, status, xhr) {
						$("#detail").html(result);
					},
					error: function (xhr, status, error) {

					}
				});
			});
		});
		</script>
	</body>
  </html>`;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
