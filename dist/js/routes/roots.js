"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const rootRouter = express_1.default.Router();
rootRouter.get("^/$|/index(.html)?", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "views", "index.html"));
});
rootRouter.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "views", "new-page.html"));
});
rootRouter.get("/old-page(.html)?", (req, res) => {
    res.redirect(301, "/new-page.html"); //302 by default
});
exports.default = rootRouter;
