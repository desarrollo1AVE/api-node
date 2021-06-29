import Utils from '../utils/index.js';
import xlsx from 'xlsx';
import { execQuery } from '../../db/index.js';
import path from 'path';



class Novelty extends Utils {
	async validateNovelties(request) {
		try {
			const data = await this.uploadFile(request);
			const numberGuiesAve = await this.extracGuides(data);
			const guidesAve = await this.getNoveltiesAve(numberGuiesAve);
			return {
				file: data,
				guidesAve,
			};
		} catch (error) {
			return {
				status: 'error',
				message: 'error en la carga del archivo',
				error
			};
		}
	}

	uploadFile(request) {
		this.loadFile(request,  './uploads/novelty/', 'archivoTCC', 'xlsx');
		const book = xlsx.readFile('./uploads/novelty/archivoTCC.xlsx');
		const sheet = book.SheetNames;
		return xlsx.utils.sheet_to_json(book.Sheets[sheet[0]]);
	}

	async extracGuides(data) {
		return data.map(item => {
			return item['NUMERO REMESA'];
		});
	}

	async getNoveltiesAve(numberGuiesAve) {
		const numberGuiesAveString = numberGuiesAve.toString();
		try {
			const query = `SELECT dsconsec AS consecutivo, dsestado AS estado, idestado 
								FROM tblpaqueteo_enc 
								WHERE dsconsec IN (${numberGuiesAveString}) 
								AND idtransportador = 1010
								AND idestado != 16`;

			const response = await execQuery(query);

			return response;
		} catch (error) {
			return [];
		}
	}
}

export default Novelty;
