import express from 'express';
import dotenv from 'dotenv';
import routes from './src/routes/index.js'

dotenv.config();
const app = express()


app.use(express.json()) 
app.use('/api', routes)


 
app.listen(process.env.PORT, () => {
  console.log(`localhost:${process.env.PORT}/`);
})