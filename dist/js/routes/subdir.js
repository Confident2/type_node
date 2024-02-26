"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const subRouter = express_1.default.Router();
subRouter.get("^/$|/index(.html)?", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "views", "subdir", "index.html"));
});
subRouter.get("/test(.html)?", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "views", "subdir", "test.html"));
});
exports.default = subRouter;
