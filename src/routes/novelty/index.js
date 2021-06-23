import express from 'express'

const router = express.Router()

router.get('/get', (req, res) => {
 return res.json({
     status : "ok"
 })
})

export default router