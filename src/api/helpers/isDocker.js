const execSync = require('child_process').execSync;

function isDocker(){
    var OS = process.platform;
    var command = "";

    if(OS  === "win32"){
        command = 'tasklist | findstr "Docker"';
    }else{
        command = 'ps -ef | grep Docker';
    }

    try{
        execSync(command, {encoding: 'utf8'});
        return true;
    } catch (err){
        //console.log(err);
        return false;
    }
}


module.exports = { isDocker };