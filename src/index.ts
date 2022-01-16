import dotenv from "dotenv";
import path from "path";
import express from "express";
import { bot } from "./bot";
dotenv.config({ path: path.join(__dirname, "./.env") });
const port = process.env.PORT || 4000;
const server = express();

server.get("/", (req: express.Request, res: express.Response) => {
  return res.status(200).send({
    message: "tritranduc is running",
  });
});

server.disable("x-powered-by");
server.listen(port, () => {
  bot();
  console.log(`🚀 Server is running on port ${port} ✨`);
});
