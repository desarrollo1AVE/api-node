import express from 'express';
import novelty from './novelty/index.js';

const router = express()

router.use('/novelty', novelty)



export default router




