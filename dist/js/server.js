"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const logEvents_1 = require("./middleware/logEvents");
const errorHandling_1 = __importDefault(require("./middleware/errorHandling"));
const PORT = process.env.PORT || 3500;
// custom middleware logger
app.use(logEvents_1.logger);
// Cross-Origin Resource Sharing
const whitelist = [
    "https://www.google.com",
    "http://localhost:3500",
    "http://127.0.0.1:5500",
];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express_1.default.json());
// serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, "/public")));
app.get("^/$|/index(.html)?", (req, res) => {
    //res.sendFile("./views/index.html", { root: __dirname });
    res.sendFile(path_1.default.join(__dirname, "views", "index.html"));
});
app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views", "new-page.html"));
});
// route handlers
app.get("/hello(.html)?", (req, res, next) => {
    console.log("attempted");
    next();
}, (req, res) => {
    res.send("hello");
});
const one = (req, res, next) => {
    console.log("one");
    next();
};
const two = (req, res, next) => {
    console.log("two");
    next();
};
const three = (req, res, next) => {
    console.log("three");
    res.send("finished");
};
app.get("/chain(.html)?", [one, two, three]);
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path_1.default.join(__dirname, "views", "404.html"));
    }
    else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    }
    else {
        res.type("txt").send("404 Not Found");
    }
});
app.use(errorHandling_1.default);
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
