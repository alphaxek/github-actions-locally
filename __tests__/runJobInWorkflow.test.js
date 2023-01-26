const { runJobInWorkflow } = require("../src/helpers/actFunctions");

console.log(runJobInWorkflow("release","publish.yml",".github\\workflows\\"));