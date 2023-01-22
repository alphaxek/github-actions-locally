// const { setupChocolaty } = require("./installChocolaty.js");
// const { setupHomeBrew } = require("./installHomeBrew.js");
const {  exec } = require("child_process");
const os = require("os");
var spawn = require("child_process").spawn,child;

const osVersion = os.version();

function setupAct(){
    console.log(`OS: ${osVersion}`);
    if(osVersion.includes("Windows")){
        // setupChocolaty(
        //     () => {
        //         console.log('Started running Act command');
        //         exec('@%ALLUSERSPROFILE%\\chocolatey\\bin\\choco install act-cli', (error, stdout, stderr) => {
        //         if (error) {
        //             console.error(`Couldn't install Act: ${error}`);
        //             return;
        //         }
        //         console.log(`stdout: ${stdout}`);
                
        //         console.log('Finished running Act command');
        //         });
        //     }
        // );
        console.log('Started running Act command');
        exec('@%ALLUSERSPROFILE%\\chocolatey\\bin\\choco install act-cli', (error, stdout, stderr) => {
        if (error) {
            console.error(`Couldn't install Act: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        
        console.log('Finished running Act command');
        });

    }else{
        setupHomeBrew(
            () => {
                console.log('Started running Act command');
                exec('brew install act', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Couldn't install Act: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                
                console.log('Finished running Act command');
                });
            }
        );
    }
}

module.exports = { setupAct };