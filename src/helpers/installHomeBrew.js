const {  exec } = require("child_process");

function setupHomeBrew() {
  console.log('Started running brew command');
    exec('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', (error, stdout, stderr) => {
        if (error) {
          console.error(`Couldn't install HomeBrew: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);

        console.log('Finished running chocolaty command');
    });
}


module.exports = { setupHomeBrew };