import express from "express";
export const kelpBotIsRunning = () => {
  const port = process.env.PORT || 4000;
  const server = express();

  server.get("/", (req: express.Request, res: express.Response) => {
    return res.status(200).send({
      message: "tritranduc is running",
    });
  });

  server.disable("x-powered-by");
  server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port} ✨`);
  });
};
