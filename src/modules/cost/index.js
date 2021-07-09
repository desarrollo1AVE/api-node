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
        tiempoTrayecto: item["TIPO DE TRAYECTO"],
        flete: item["FLETE X UNID DE PESO"],
        tiempoEntrega: item["TIEMPO DE ENTREGA"],
        trayecto: item["TRAYECTO "],
        codeDaneOrigin,
        codeDaneDestion,
      };
    });

    return {
      dataChangeKey,
    };
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
