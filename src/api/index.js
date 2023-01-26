const express = require('express')
const cors = require('cors');
const { runJob } = require("./../helpers/index");
const { heartbeat, isDocker } = require("./helpers/index");
const app = express()

app.use(cors({
    origin: '*'
}));

app.get('/runworkflow', function (req, res) {
    console.log(runJob(req.query.job, req.query.path));
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