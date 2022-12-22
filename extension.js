const vscode = require('vscode');
const path = require('path');
const custom_act = require("./src/helpers/index");

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

		// console.log(custom_act.getAllActions(vscode.workspace.workspaceFolders[0].uri['_fsPath']));
		const workflows = custom_act.getAllActions(vscode.workspace.workspaceFolders[0].uri['_fsPath']);
		
		var listOfWorkflows = [];

		for(const workflow in workflows['response']){
			listOfWorkflows[workflow] =  workflows['response'][workflow]['workflow_name'];
		}

		var listOfWorkflowsuSet = new Set(listOfWorkflows);
		var htmlWorkflow ="";

		for(const workflow in [...listOfWorkflowsuSet]){
			htmlWorkflow += `
			<div class="workflow">
				<div class="active" style="visibility: visible"></div>
				<p class="label">${[...listOfWorkflowsuSet][workflow]}</p>
			</div>`;
		}

		var htmlJob ="";

		for(const workflow in workflows['response']){
			htmlJob += `
			<div class="job">
				<img src="${imgWaiting}" class="status symbol"/>
	  			<p class="label">${workflows['response'][workflow]['job_name']}</p>
  			</div>`;
		}

		// And set its HTML content
		panel.webview.html = getWebviewContent(imgSummary, imgCorrect, imgSuccess, imgRemove, imgWaiting, imgLoading, script, style, htmlWorkflow, htmlJob);
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(imgSummary, imgCorrect, imgSuccess, imgRemove, imgWaiting, imgLoading, script, style, htmlWorkflow, htmlJob) {
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
			  <h3 class="txtTwo">Jobs</h3>
			  <div class="hr"></div>
			  ${htmlJob}
		  </div>
		  <div class="main">
			  <button>Run Job</button>
			  <br>
			  <div class="info">
				  <h5>Triggered 3 mins ago</h5>
				  <div class="info-status">
					  <p class="txtThree">Status</p>
					  <p>Success</p>
				  </div>
				  <div class="info-duration">
					  <p class="txtThree">Duration</p>
					  <p>48s</p>
				  </div>
			  </div>
			  <div class="job-step">
				  <div class="job-status">
					  <p>Status</p>
					  <p class="txtThree">Succeeded 3 mins ago</p>
				  </div>  
				  <div class="hr"></div>
				  <div class="step" onclick="showDetails('step1')"   >
					  <img src="${imgCorrect}" class="status symbol"/>
					  <p class="label">Step 1</p>
					  <p class="duration">48s</p>
					  <div class="detail" id="step1" id="detail">
						  <p>1 details</p>
						  <p>2 details</p>
						  <p>3 details</p>
						  <p>4 details</p>
						  <p>5 details</p>
					  </div>
				  </div>
				  <div class="step" onclick="showDetails('step2')">
					  <img src="${imgLoading}" class="status symbol"/>
					  <p class="label">Step 2</p>
					  <p class="duration">236s</p>
					  <div class="detail" id="step2">
						  <p><i>Waiting</i></p>
					  </div>
				  </div>
				  <div class="step" onclick="showDetails('step3')">
					  <img src="${imgWaiting}" class="status symbol"/>
					  <p class="label">Step 3</p>
					  <p class="duration"></p>
					  <div class="detail" id="step3">
						  <p><i>Waiting</i></p>
					  </div>
				  </div>
				  <div class="step" onclick="showDetails('step4')">
					  <img src="${imgWaiting}" class="status symbol"/>
					  <p class="label">Step 4</p>
					  <p class="duration"></p>
					  <div class="detail" id="step4">
						  <p><i>Waiting</i></p>
					  </div>
				  </div>
			  </div>
		  </div>
	  </div>
	  <script src="${script}"></script>
	</body>
  </html>`;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
