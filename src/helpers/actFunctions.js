const execSync = require('child_process').execSync;

function getAllActions(path){ 
    try {
        const workflows =  execSync(`@${__dirname}\\..\\chocolatey\\bin\\act -l --workflows ${path+'\\.github\\workflows\\'}`).toString().split(/[\t\n]+/);

        const lengths = [[0, workflows[0].substring(0,workflows[0].indexOf('Job ID')).length],
                         [workflows[0].indexOf('Job ID'), workflows[0].indexOf('Job name')],
                         [workflows[0].indexOf('Job name'), workflows[0].indexOf('Workflow name')],
                         [workflows[0].indexOf('Workflow name'), workflows[0].indexOf('Workflow file')],
                         [workflows[0].indexOf('Workflow file'), workflows[0].indexOf('Events')],
                         [workflows[0].indexOf('Events'), workflows[0].length]];

        var response = `{ "response" : [`;
        
        for (let i=1; i < workflows.length-2; i++) {
            const workflow = `{"stage":"${workflows[i].substring(lengths[0][0],lengths[0][1]).trim()}",
                               "job_id":"${workflows[i].substring(lengths[1][0],lengths[1][1]).trim()}",
                               "job_name":"${workflows[i].substring(lengths[2][0],lengths[2][1]).trim()}",
                               "workflow_name":"${workflows[i].substring(lengths[3][0],lengths[3][1]).trim()}",
                               "workflow_file":"${workflows[i].substring(lengths[4][0],lengths[4][1]).trim()}",
                               "events":"${workflows[i].substring(lengths[5][0],lengths[5][1]).trim()}"},`;
            response += workflow;
        }

        response = response.slice(0, response.length - 1);
        response += ']}';
        response = JSON.parse(response);
        
        return response;
    }
    catch (e) {
        return e.message;
    }
}

function getActionOnEvent(eventName, path){
    try {
        return execSync(`@${__dirname}\\..\\chocolatey\\bin\\act ${eventName} -l --workflows ${path}`).toString().split(/[\t\n]+/);
    }
    catch (e) {
        return e;
    }
}

function getActionOnJob(jobName, path){
    try {
        return execSync(`@${__dirname}\\..\\chocolatey\\bin\\act -j ${jobName} -l --workflows ${path}`).toString().split(/[\t\n]+/);
    }
    catch (e) {
        return e;
    }
}

function runEvent(event, path){
    try {
        return execSync(`@${__dirname}\\..\\chocolatey\\bin\\act -v ${event} --workflows ${path}`).toString().split(/[\t\n]+/);
    }
    catch (e) {
        return e;
    }
}

function runJob(job, path){
    try {
        var a = `@${__dirname}\\..\\chocolatey\\bin\\act -j -v ${job} --directory ${path}`;
        console.log(a);
        return execSync(a).toString().split(/[\t\n]+/);
    }
    catch (e) {
        return e;
    }
}

function runJobInWorkflow(job, workflow, path){
    try {
        return execSync(`@${__dirname}\\..\\chocolatey\\bin\\act act -j ${job} -v -W ${path+workflow}`).toString().split(/[\t\n]+/);
        //act -j release -v -W d:\GitHub\galCopy\.github\workflows\publish.yml
    }
    catch (e) {
        console.log("WE are  here")
        return e;
    }
}

function dryRun(path){
    // exec(`@${__dirname}\\..\\chocolatey\\bin\\act -n`, (error, stdout) => {
    //     if (error) {
    //         console.error(`Couldn't dry run : ${error}`);
    //         return error;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     return stdout;
    // });

    try {
        return execSync(`@${__dirname}\\..\\chocolatey\\bin\\act -n --directory  ${path}`).toString().split(/[\t\n]+/);
    }
    catch (e) {
        return e;
    }
}

module.exports = { getAllActions, getActionOnEvent, getActionOnJob, runEvent, runJob, runJobInWorkflow, dryRun };