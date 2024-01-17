import logEvents from "./logEvents";
import EventEmitter from "events";

class MyEmitter extends EventEmitter {}

// initialize object
const myEmitter = new MyEmitter();

// add listener for log event
myEmitter.on("log", (msg: string) => logEvents(msg));

setTimeout(() => {
  myEmitter.emit("log", "Log event emitted");
}, 2000);
