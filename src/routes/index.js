import express from 'express';
import novelty from './novelty/index.js';
import cost from './cost/index.js';
import time from './time/index.js';

const router = express()

router.use('/novelty', novelty)
router.use('/cost', cost)
router.use('/time', time)



export default router




