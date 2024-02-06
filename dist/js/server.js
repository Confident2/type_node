"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT || 3500;
// serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, "/public")));
app.get("^/$|/index(.html)?", (req, res) => {
    //res.sendFile("./views/index.html", { root: __dirname });
    res.sendFile(path_1.default.join(__dirname, "views", "index.html"));
});
app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views", "new-page.html"));
});
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
