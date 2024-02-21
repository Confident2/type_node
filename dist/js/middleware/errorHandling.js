"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logEvents_1 = require("./logEvents");
const errorHandler = (err, req, res, next) => {
    (0, logEvents_1.logEvents)(`${err.name}: ${err.message}`, "errLog.txt");
    console.error(err.stack);
    res.status(500).send(err.message);
};
exports.default = errorHandler;
