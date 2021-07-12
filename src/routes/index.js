import express from 'express';
import novelty from './novelty/index.js';
import cost from './cost/index.js';

const router = express()

router.use('/novelty', novelty)
router.use('/cost', cost)



export default router




