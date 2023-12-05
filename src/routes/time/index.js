import express from "express";
import Time from '../../modules/time/index.js';


const time = new Time();

const router = express.Router();

router.post("/change", async (req, res) => {
  const response = await time.readFile()    
  res.json(response);
});

export default router;
