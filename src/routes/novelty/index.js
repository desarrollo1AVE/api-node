import express from 'express';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';
import Novelty from '../../modules/novelty/index.js';
const novelty = new Novelty();

const router = express.Router();

router.post('/readFile', async (req, res) => {
	const response = await novelty.validateNovelties(req)

	res.json(response)
});

export default router;
