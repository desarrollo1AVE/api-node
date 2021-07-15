import express, { request } from 'express';
import Novelty from '../../modules/novelty/index.js';
const novelty = new Novelty();

const router = express.Router();

router.post('/readFile', async (req, res) => {
	try {
		const response = await novelty.validateNovelties(req);
		res.json(response);
	} catch (error) {
		res.json({
			status : "error",
			message : "Error en la carga del archivo"
		});
	}
});

router.post('/updateGuides', async (req, res) => {
	const response = await novelty.updateGuides(req.body.guidesComplete);
	res.json(response)
});

router.post('/getStatusGuide', async (req, res)=>{
	const response = await novelty.getStatusGuide(req.body.guide)
	console.log(response);
	res.json(response)
})
export default router;
