const express = require('express')
const cors = require('cors');
const { runJob } = require("../helpers/actFunctions");
const app = express()

app.use(cors({
    origin: '*'
}));

app.get('/runworkflow', function (req, res) {
    console.log(runJob(req.query.job, req.query.path));
})

app.get('/heartbeat', function (req, res) {
    res.sendStatus(200);
})


function startAPI() {
    app.listen(7867, () => {
        console.log("API is ready");
    })
}

module.exports = { startAPI };