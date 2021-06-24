import express from 'express';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';
import Novelty from '../../modules/novelty/index.js';
// const novelty = new Novelty();

const router = express.Router();

router.post('/readFile', (req, res) => {
	const form = formidable({ multiples: true, uploadDir: './uploads/novelty' });
	form.parse(req, (err, fields, files) => {
		if (err) {
			next(err);
			return;
		} else {
			fs.rename(files.archivo.path, './uploads/novelty/test.xlsx');
		}
	});
	const response = {};
	res.json(response);
});

export default router;
