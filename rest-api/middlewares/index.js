const { log } = require('console');
const fs = require('fs');

function logReqRes(fileName){
  return (req, res, next) => {
    fs.appendFile(fileName, `${req.method}: ${Date.now()}: ${req.path}\n`, (err, data) => {
      next();
    });
  }
}

module.exports = {
  logReqRes
};