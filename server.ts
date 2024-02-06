import express from "express";
import { Request, Response, NextFunction } from "express";
const app = express();
import path from "path";
import cors from "cors";
import { logger } from "./middleware/logEvents";
import errorHandler from "./middleware/errorHandling";
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross-Origin Resource Sharing

const whitelist = [
  "https://www.google.com",
  "http://localhost:3500",
  "http://127.0.0.1:5500",
];
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, success?: boolean) => void
  ) => {
    if (whitelist.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  //res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

// route handlers
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

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
