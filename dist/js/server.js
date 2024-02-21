"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT || 3500;
const serveFile = (filePath, contentType, response) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const emptyString = "";
      const rawData = yield fs_1.promises.readFile(
        filePath,
        !contentType.includes("image") ? "utf8" : undefined
      );
      response.writeHead(filePath.includes("404.html") ? 404 : 200, {
        "content-Type": contentType,
      });
      if (contentType === "application/json") {
        const data = JSON.parse(rawData.toString("utf8"));
        response.end(JSON.stringify(data));
      } else {
        response.end(rawData, "binary");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        myEmitter.emit("log", `${error.name}\t${error.message}`, "errLog.txt");
        response.statusCode = 500;
        response.end();
      } else {
        // Handle the case when 'error' is not of type Error
        console.error("Unexpected error type:", typeof error);
        // Additional error handling or logging if needed
        response.statusCode = 500;
        response.end();
      }
    }
  });
const server = http_1.default.createServer((req, res) => {
  console.log(req.url, req.method);
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");
  const extension = path_1.default.extname(req.url || "");
  let contentType;
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }
  let filePath =
    contentType === "text/html" && (req.url || "") === "/"
      ? path_1.default.join(__dirname, "views", "index.html")
      : contentType === "text/html" && (req.url || "").slice(-1) === "/"
      ? path_1.default.join(__dirname, "views", req.url || "", "index.html")
      : contentType === "text/html"
      ? path_1.default.join(__dirname, "views", req.url || "")
      : path_1.default.join(__dirname, req.url || "");
  // makes the .html extension not required in the browser
  if (!extension && (req.url || "").slice(-1) !== "/") filePath += ".html";
  const fileExist = (0, fs_1.existsSync)(filePath);
  if (fileExist) {
    serveFile(filePath, contentType, res);
  } else {
    switch (path_1.default.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { location: "/" });
        res.end();
        break;
      default:
        serveFile(
          path_1.default.join(__dirname, "views", "404.html"),
          "text/html",
          res
        );
    }
  }
});
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
