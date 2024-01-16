"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const formattedDate = (0, date_fns_1.format)(new Date(), "yyyy-MM-dd\tHH:mm:ss");
const generatedUuid = (0, uuid_1.v4)();
console.log(formattedDate);
console.log(generatedUuid);
