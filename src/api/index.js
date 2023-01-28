const express = require('express')
const cors = require('cors');
const { runJobInWorkflow } = require("./../helpers/index");
const { heartbeat, isDocker } = require("./helpers/index");
const app = express()

app.use(cors({
    origin: '*'
}));

app.post('/runjobinworkflow', function (req, res) {
    try {
        var response = runJobInWorkflow(req.query.job, req.query.workflow, req.query.path);
        res.status(200).json({ response: response });
    }
    catch (e) {
        res.status(410).json({ response: e });
    }
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