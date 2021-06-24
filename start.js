import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import cors from 'cors';

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

app.listen(process.env.PORT, () => {
	console.log(`localhost:${process.env.PORT}/`);
});
