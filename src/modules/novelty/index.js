import Utils from "../utils/index.js";
import xlsx from "xlsx";
import formidable from "formidable";
import { execQuery } from "../../db/index.js";
import axios from "axios";
import xml2js from "xml2js";
class Novelty extends Utils {
  constructor() {
    super();
    this.idStateNovelty = 16;
    this.idTcc = 1010;
  }
  async validateNovelties(request) {
    try {
      const data = await this.uploadFile(request);
      const numberGuiesAve = await this.extracGuides(data);
      const guidesAve = await this.getNoveltiesAve(numberGuiesAve);
      const guidesComplete = await this.mergeData(guidesAve, data);
      return {
        status: "ok",
        message: "Registros encontrados",
        guidesComplete,
      };
    } catch (error) {
      return {
        status: "error",
        message: "error en la carga del archivo",
        guidesComplete: [],
        error,
      };
    }
  }

  uploadFile(request) {
    this.loadFile(request, "./uploads/novelty/", "archivoTCC", "xlsx");
    const book = xlsx.readFile("./uploads/novelty/archivoTCC.xlsx");
    const sheet = book.SheetNames;
    const data = xlsx.utils.sheet_to_json(book.Sheets[sheet[0]]);

    const dataChangeKey = data.map(item => {
      return {
        numeroRemesa: item["NUMERO REMESA"],
        remitente: item["REMITENTE"],
        direccionRemiente: item["DIRECCION REMITENTE"],
        destinatario: item["DESTINATARIO"],
        direccionDestinatario: item["DIRECCION DESTINO"],
        fechaNovedad: item["FECHA NOVEDAD"],
        novedad: item["NOVEDAD"],
        complemento: item["COMPLEMENTO"],
        comentario: item["COMENTARIO"],
        atribuir: item["ATRIBUIBLE A"],
        uen: item["UEN"],
        remitente1: item["REMITENTE_1"],
        asesor: item["Asesor"],
      };
    });

    return dataChangeKey;
  }

  async extracGuides(data) {
    return data.map(item => {
      return item["numeroRemesa"];
    });
  }

  async getNoveltiesAve(numberGuiesAve) {
    const numberGuiesAveString = numberGuiesAve.toString();
    try {
      const query = `SELECT dsconsec AS consecutivo, dsestado AS estadoAve, idestado 
								FROM tblpaqueteo_enc 
								WHERE dsconsec IN (${numberGuiesAveString}) 
								AND idtransportador = 1010
								AND idestado != ${this.idStateNovelty}`;

      const response = await execQuery(query);

      return response;
    } catch (error) {
      return [];
    }
  }

  mergeData(guidesAve, data) {
    const newData = guidesAve.map(item => {
      const dataComplete = data.find(
        element => element.numeroRemesa == item.consecutivo
      );
      return { ...item, ...dataComplete };
    });

    return newData.filter(Boolean);
  }

  async updateGuides(guides) {
    if (guides.length > 0) {
      try {
        guides.forEach(item => {
          const sqlPaqueteo = `UPDATE tblpaqueteo_enc 
											SET idestado = ${this.idStateNovelty}, 
											dsestado = 'EN NOVEDAD' 
											WHERE dsconsec = '${item.consecutivo}' 
											AND idtransportador = ${this.idTcc} `;
        });

        const sqlEstado = `INSERT INTO tblestados_guias (
					dsguia, dsestado, dsdescripcion, dsaclaracion, dscomentario, dsfecha,
					idnovedad, idexp, Cod_Novedad, Des_Novedad,
					Tipo_OrigenNovedad, idtransportadora, dstransportadora, idguia, idfecha
				) VALUES ? `;

        const params1 = guides?.map(item => [
          item?.consecutivo,
          "NOVEDAD",
          item?.comentario,
          item?.complemento,
          item?.comentario,
          item?.fechaNovedad,
          1,
          // item?.cuenta,
          // item?.idEmpresa,
          // fieldOptional.codigoNovedad(item?.codigoNovedad),
          // fieldOptional.dsdescripcion(item?.nombreNovedad),
          // fieldOptional.tipoOrigenNovedad(),
          // fieldOptional.idTransportadora,
          // fieldOptional.dsTransportadora,
          // fieldOptional.idFecha,
        ]);

        console.log(params1);
        // const response = await execQuery({
        // 	mutation: this.mutation.addNewStates(),
        // 	params: params1,
        // })
      } catch (error) {}
    }

    return guides;
  }

  async getStatusGuide(guide) {
    return new Promise((resolve, reject) => {
      let xmls = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
					<Body>
						<ConsultarInformacionRemesasEstadosUENV1  xmlns="http://clientes.tcc.com.co/">
							<Clave>MEDAVEGROUP</Clave>
							<remesas>
								<RemesaUEN>
									<numeroremesa>${guide}</numeroremesa>
								</RemesaUEN>
							</remesas>
							<Respuesta>0</Respuesta>
							<Mensaje>0</Mensaje>
						</ConsultarInformacionRemesasEstadosUENV1>
					</Body>
					</Envelope>`;

      axios
        .post(
          "http://clientes.tcc.net.co/servicios/informacionremesas.asmx",
          xmls,
          {
            headers: { "Content-Type": "text/xml" },
          }
        )
        .then(res => {
          xml2js.parseString(res.data, (err, data) => {
            resolve(data);
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
}

export default Novelty;
