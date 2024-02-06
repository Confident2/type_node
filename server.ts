import express from "express";
import { Request, Response, NextFunction } from "express";
const app = express();
import path from "path";
const PORT = process.env.PORT || 3500;

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

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
