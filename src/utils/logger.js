const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs.txt'); // Logs will be saved in 'utils/logs.txt'

const logToFile = (data) => {

  fs.appendFile(logFilePath, `${data}\n`, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    } else {
      console.log('Log entry added!');
    }
  });
};

const deleteLogsEvery7Days = () => {
  setInterval(() => {
    if (fs.existsSync(logFilePath)) {
      fs.truncate(logFilePath, '', (err) => {
        if (err) {
          console.error('Error clearing log file:', err);
        } else {
          console.log('Log file cleared after 7 days.');
        }
      });
    }
  },7 * 24 * 60 * 60 * 1000); // Runs every 7 days
};
deleteLogsEvery7Days();

module.exports = {
  logToFile,
};