var log = require('./logging.js');

var testObj = {
    "x": 0,
    "y": 1,
    "z": 2,
    "asd": 3,
    "hello": "hello"
};

log.initLog("test");
log.logObjToJSON(testObj);
log.endLog();