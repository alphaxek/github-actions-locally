const express = require('express')
const cors = require('cors');
const { runJobInWorkflow } = require("./../helpers/index");
const { heartbeat, isDocker } = require("./helpers/index");
const app = express()

app.use(cors({
    origin: '*'
}));

app.post('/runjobinworkflow', function (req, res) {
    console.log(req.query.job);
    console.log(req.query.workflow);
    console.log(req.query.path);
    var response = runJobInWorkflow(req.query.job, req.query.workflow, req.query.path)
    res.json({ response: response });
})

app.get('/heartbeat', function (req, res) {
    if(heartbeat()){
        res.sendStatus(200);
    }
})

app.get('/isdocker', function (req, res) {
    if(isDocker()){
        res.sendStatus(200);
    }else{
        res.sendStatus(410);
    }
})


function startAPI() {
    app.listen(7867, () => {
        console.log("API is ready");
    })
}

module.exports = { startAPI };