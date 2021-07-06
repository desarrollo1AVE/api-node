import Utils from '../utils/index.js';
import xlsx from 'xlsx';
import { execQuery } from '../../db/index.js';

class Novelty extends Utils {
	async validateNovelties(request) {
		try {
			const data = await this.uploadFile(request);
			const numberGuiesAve = await this.extracGuides(data);
			const guidesAve = await this.getNoveltiesAve(numberGuiesAve);
			const guidesComplete = await this.mergeData(guidesAve, data);
			return {
				file: data,
				guidesAve,
				guidesComplete
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
		this.loadFile(request, './uploads/novelty/', 'archivoTCC', 'xlsx');
		const book = xlsx.readFile('./uploads/novelty/archivoTCC.xlsx');
		const sheet = book.SheetNames;
		const data = xlsx.utils.sheet_to_json(book.Sheets[sheet[0]]);

		const dataChangeKey = data.map(item => {
			return {
				numeroRemesa: item['NUMERO REMESA'],
				remitente: item['REMITENTE'],
				direccionRemiente: item['DIRECCION REMITENTE'],
				destinatario: item['DESTINATARIO'],
				direccionDestinatario: item['DIRECCION DESTINO'],
				fechaNovedad: item['FECHA NOVEDAD'],
				novedad: item['NOVEDAD'],
				complemento: item['COMPLEMENTO'],
				comentario: item['COMENTARIO'],
				atribuir: item['ATRIBUIBLE A'],
				uen: item['UEN'],
				remitente1: item['REMITENTE_1'],
				asesor: item['Asesor']
			};
		});

		return dataChangeKey;
	}

	async extracGuides(data) {
		return data.map(item => {
			return item['numeroRemesa'];
		});
	}

	async getNoveltiesAve(numberGuiesAve) {
		const numberGuiesAveString = numberGuiesAve.toString();
		try {
			const query = `SELECT dsconsec AS consecutivo, dsestado AS estadoAve, idestado 
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

	mergeData(guidesAve, data) {
		const newData = guidesAve.map(item => {
			const dataComplete = data.find(element => element.numeroRemesa == item.consecutivo);
			return { ...item, ...dataComplete };
		});

		return newData.filter(Boolean);
	}
}

export default Novelty;
