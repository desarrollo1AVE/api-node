import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import cors from 'cors';
import https from 'https'
import fs from 'fs'

import routes from './src/routes/index.js';

dotenv.config();
const app = express();

// app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);

app.use('/api', routes);

app.use(
	fileUpload({
		createParentPath: true
	})
);

app.use(cors());
app.use(morgan('dev'));

const options = { 
  key: fs.readFileSync('/var/www/aveonline.co/ssl/aveonline.co-le.key'),
  cert: fs.readFileSync('/var/www/aveonline.co/ssl/aveonline.co-le.crt')
}

https.createServer(options, app).listen(5015)

//app.listen(process.env.PORT, () => {
//	console.log(`localhost:${process.env.PORT}/`);
//});
