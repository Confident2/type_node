import express from "express";
import path from "path";
import { Router } from "express";
import { Request, Response } from "express";

const subRouter: Router = express.Router();

subRouter.get("^/$|/index(.html)?", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
});
subRouter.get("/test(.html)?", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "test.html"));
});

export default subRouter;
