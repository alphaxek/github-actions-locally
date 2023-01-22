const express = require('express')
const app = express()

const { runJob } = require("../helpers/actFunctions");


app.get('/runworkflow', function (req, res) {
    console.log(runJob(req.query.job, req.query.path));
})

function startAPI() {
    app.listen(7867, () => {
        console.log("API is ready");
    })
}

module.exports = { startAPI };