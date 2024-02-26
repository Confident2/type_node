import express from "express";
import path from "path";
import { Router } from "express";
import { Request, Response } from "express";

const rootRouter: Router = express.Router();

rootRouter.get("^/$|/index(.html)?", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});
rootRouter.get("/new-page(.html)?", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});
rootRouter.get("/old-page(.html)?", (req: Request, res: Response) => {
  res.redirect(301, "/new-page.html"); //302 by default
});

export default rootRouter;