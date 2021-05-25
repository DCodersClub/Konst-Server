const chalk = require('chalk');

exports.link = (link = '') => {
  return chalk.red(link);
};

exports.successLog = (message = '') => {
  const text = chalk.yellowBright(message);
  console.log(text);
};
