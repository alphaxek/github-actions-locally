const { exec } = require("child_process");


function setupChocolaty(installAct) {
  console.log('Started running chocolaty command');
  exec('@"%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://community.chocolatey.org/install.ps1\'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\\chocolatey\\bin"', (error, stdout, stderr) => {
      if (error) {
        console.error(`Couldn't install Chocolaty: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);

      console.log('Finished running chocolaty command');

      installAct();
  });
}


module.exports = { setupChocolaty };