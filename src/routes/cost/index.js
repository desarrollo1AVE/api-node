import express, { request } from "express";
import Cost from "../../modules/cost/index.js";

const cost = new Cost();

const router = express.Router();

router.post("/loadCost", async (req, res) => {
  const response = await cost.loadFile(req);

  res.json(response);
});

export default router;
