const chalk = require('chalk');

exports.link = (link = '') => {
  return chalk.red(link);
};

exports.successLog = (message = '') => {
  const text = chalk.greenBright(message);
  console.log(text);
};

exports.errorLog = (message = '') => {
  const text = chalk.bgRed.white(message);
  console.log(text);
};
