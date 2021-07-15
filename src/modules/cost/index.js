import Utils from "../utils/index.js";
import xlsx from "xlsx";
import { execQuery } from "../../db/index.js";

class Cost extends Utils {

  async loadFile() {
    const book = xlsx.readFile("./uploads/cost/costosservientrega.xls");
    const sheet = book.SheetNames;
    const data = xlsx.utils.sheet_to_json(book.Sheets[sheet[0]]);
    const cities = await this.getCodeDaneCity();

    const dataChangeKey = data.map((item, index) => {
      let origin = cities.find(
        element => element.poblacion == item["Ciudad Origen"]
      );
      let destination = cities.find(
        element => element.poblacion == item["Ciudad Destino"]
      );
      let codeDaneOrigin = origin == undefined ? "" : origin.codigoDane;

      let codeDaneDestion = destination == undefined ? "" : destination.codigoDane;
      return {
        ciudadOrigen: item["Ciudad Origen"],
        ciudadDestino: item["Ciudad Destino"],
        tipoTrayecto: item["TIPO DE TRAYECTO"],
        flete: item["FLETE X UNID DE PESO "],
        tiempoEntrega: item["TIEMPO DE ENTREGA"],
        trayecto: item["TRAYECTO "],
        codeDaneOrigin,
        codeDaneDestion,
      };
    });

    const insert = await this.insertCosts(dataChangeKey);
 
    return {
      insert,
    };
  }

  async insertCosts(costsToInsert){

    const queryInsert =`INSERT INTO tblproveedores_costos12072021 
                      (idcliente, idtransportadora, dspaisorigen, dscodciudadorigen, dsciudadorigen, dspaisdestino, dscodciudadestino, dsciudaddestino, dstipotrayecto, dsfletexunidxpeso, dstiempoentrega, dstrayectoequivalente, dsfechai, dsfechaf, idfechai, idfechaf, idactivo) 
                      VALUES ?`;

    const params = costsToInsert?.map((item) => [
      '9999',
      '33',
      'Colombia',
      item?.codeDaneOrigin == '' ? 0: item.codeDaneOrigin,
      item?.ciudadOrigen,
      'Colombia',
      item?.codeDaneDestion == '' ? 0: item.codeDaneDestion,
      item?.ciudadDestino,
      item?.tipoTrayecto,
      item?.flete,
      item?.tiempoEntrega,
      item?.tipoTrayecto,
      '2020/10/01',
      '2021/08/31',
      '20201001',
      '20210831',
      '1',
    ])

    const responseInsert = await execQuery(queryInsert,params);
    return responseInsert;

  }


  async getCodeDaneCity() {
    const query = `SELECT DISTINCT(POBLACION) AS poblacion, dscodigodian AS codigoDane
                        FROM tblpaqueteo_ciudades_nacionales 
                        WHERE dscodigodian > 0`;

    const response = await execQuery(query);
    return response;
  }
}

export default Cost;
