import express from "express";
import { Request, Response, NextFunction } from "express";
import path from "path";
import http from "http";
import fs from "fs";
import dotenv from "dotenv";
import logEvents from "./logEvents";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

// Serve static files
app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

// Route handlers
app.get(
  "/hello(.html)?",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("attempted");
    next();
  },
  (req: Request, res: Response) => {
    res.send("hello");
  }
);

const one = (req: Request, res: Response, next: NextFunction) => {
  console.log("one");
  next();
};

const two = (req: Request, res: Response, next: NextFunction) => {
  console.log("two");
  next();
};

const three = (req: Request, res: Response, next: NextFunction) => {
  console.log("three");
  res.send("finished");
};

app.get("/chain(.html)?", [one, two, three]);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

const myEmitter = new http.Server();

myEmitter.on("log", (msg: string, fileName: string) =>
  logEvents(msg, fileName)
);

const serveFile = async (
  filePath: string,
  contentType: string,
  response: http.ServerResponse
) => {
  try {
    const rawData: string | Buffer = await fs.promises.readFile(
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
      console.error("Unexpected error type:", typeof error);
      response.statusCode = 500;
      response.end();
    }
  }
};

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log(req.url, req.method);
    myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

    const extension: string = path.extname(req.url || "");
    let contentType: string;
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

    let filePath: string =
      contentType === "text/html" && (req.url || "") === "/"
        ? path.join(__dirname, "views", "index.html")
        : contentType === "text/html" && (req.url || "").slice(-1) === "/"
        ? path.join(__dirname, "views", req.url || "", "index.html")
        : contentType === "text/html"
        ? path.join(__dirname, "views", req.url || "")
        : path.join(__dirname, req.url || "");

    if (!extension && (req.url || "").slice(-1) !== "/") filePath += ".html";

    const fileExist: boolean = fs.existsSync(filePath);
    if (fileExist) {
      serveFile(filePath, contentType, res);
    } else {
      switch (path.parse(filePath).base) {
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
            path.join(__dirname, "views", "404.html"),
            "text/html",
            res
          );
      }
    }
  }
);

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
