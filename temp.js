// const _ = require('lodash');
// const ps = require('current-processes');

// ps.get((err, processes) => {
//   if (err) throw err
//   let sorted = _.sortBy(processes, 'cpu');
//   let top5 = sorted.reverse().splice(0, 5);
//   console.log(top5);
// });

const { spawn } = require('child_process');

// Define the path to the log file you want to monitor (e.g., /var/log/auth.log)
const logFilePath = '/var/log/auth.log';

// Create a child process to watch the log file
const tailProcess = spawn('tail', ['-f', logFilePath]);

// Listen for data events when a new line is added to the log file
tailProcess.stdout.on('data', (data) => {
  const logEntry = data.toString();
  
  // Check if the log entry indicates a login event (you can modify this based on your log format)
  if (logEntry.includes('sshd') && logEntry.includes('Accepted')) {
    // Log the login event
    console.log(`Login Event: ${logEntry}`);
  }
});

// Handle errors, if any
tailProcess.stderr.on('data', (data) => {
  console.error(`Error: ${data.toString()}`);
});

// Handle process exit
tailProcess.on('close', (code) => {
  console.log(`Tail process exited with code ${code}`);
});
