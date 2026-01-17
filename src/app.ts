import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res
    .status(200)
    .json({ error: false, message: "OK", date: new Date(Date.now()) });
});

export default app;
