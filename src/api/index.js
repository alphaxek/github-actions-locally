const express = require('express')
const cors = require('cors');
const { runJobInWorkflow } = require("./../helpers/index");
const { heartbeat, isDocker } = require("./helpers/index");
const app = express()
var server;

app.use(cors({
    origin: '*'
}));

app.post('/runjobinworkflow', function (req, res) {
    try {
        var response = runJobInWorkflow(req.query.job, req.query.workflow, req.query.path);
        res.status(200).json({ response: response });
    }
    catch (e) {
        res.status(410).json({ response: e.message });
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

app.get('/stopApi', function (req, res) {
    try{
        server.close(function() { console.log('API closed'); });
        res.sendStatus(200);
    }
    catch (e) {
        res.status(410).json({ response: e.message });
    }
})

function startAPI() {
    try{
        server = app.listen(7867, () => {
            console.log("API is ready");
        });
    }
    catch (e) {
        console.log(e.message);
    }
}


module.exports = { startAPI };