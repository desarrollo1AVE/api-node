import Utils from "../utils/index.js";
import xlsx from "xlsx";
import { execQuery } from "../../db/index.js";
import { writeFile } from "fs/promises";

class Cost extends Utils {
  async loadFile() {
    // const book = xlsx.readFile("./uploads/cost/costosservientrega.xls");
    const book = xlsx.readFile("./uploads/cost/ENVIA-RESTANTE.ods");
    const sheet = book.SheetNames;
    const data = xlsx.utils.sheet_to_json(book.Sheets[sheet[0]]);
    const cities = await this.getCodeDaneCity();

    const ciudadOrigen = "Ciudad Origen";
    const ciudadDestino = "Ciudad Destino";

    const newData = data.map((element) => {
      const destino = element[ciudadDestino].split("(");
      const origen = element[ciudadOrigen].split("(");
      const convertDestino = destino[2] ? destino[2] : destino[1];
      const convertOrigen = origen[2] ? origen[2] : origen[1];

      return {
        ...element,
        "Ciudad Origen": `${origen[0]}(${convertOrigen}`,
        "Ciudad Destino": `${destino[0]}(${convertDestino}`,
      };
    });

    const dataChangeKey = newData.map((item, index) => {
      let origin = cities.find(
        (element) => element.poblacion == item["Ciudad Origen"]
      );
      let destination = cities.find(
        (element) => element.poblacion == item["Ciudad Destino"]
      );
      let codeDaneOrigin = origin == undefined ? "" : origin.codigoDane;

      let codeDaneDestion =
        destination == undefined ? "" : destination.codigoDane;
      return {
        ciudadOrigen: item["Ciudad Origen"],
        ciudadDestino: item["Ciudad Destino"],
        tipoTrayecto: item["TIPO DE TRAYECTO"],
        flete: item["flete"],
        tiempoEntrega: item["TIEMPO DE ENTREGA"],
        trayecto: item["trayecto"],
        codeDaneOrigin,
        codeDaneDestion,
      };
    });

    function chunk(array, size) {
      const chunked = [];

      for (let i = 0; i < array.length; i = i + size) {
        chunked.push(array.slice(i, i + size));
      }

      return chunked;
    }
    // console.log(JSON.stringify(chunk(dataChangeKey,1000)));

    function saveFile({ path = "./logs/example.txt", data }) {
      try {
        const save = writeFile(path, data);
        const success = { status: true, message: `success - ${path}` };
        const danger = { status: false, message: "not save" };
        return save ? success : danger;
      } catch (error) {
        console.log("error to save file");
        console.log(error);
        return { status: false, message: error.message };
      }
    }

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const fragments = chunk(dataChangeKey, 20000);
    let response = [];
    for (const fragment of fragments) {
      try {
        const insert = await this.insertCosts(fragment);
        response.push(insert);
        await sleep(5000)

      } catch (error) {
        console.log("main:", error);
      }
    }

   return {response}

   

    // console.log(JSON.stringify(dataChangeKey));
  }

  async insertCosts(costsToInsert) {
    const queryInsert = `INSERT INTO tblproveedores_costos01102021
                      (idcliente, idtransportadora, dspaisorigen, dscodciudadorigen, dsciudadorigen, dspaisdestino, dscodciudadestino, dsciudaddestino, dstipotrayecto, dsfletexunidxpeso, dstiempoentrega, dstrayectoequivalente, dsfechai, dsfechaf, idfechai, idfechaf, idactivo) 
                      VALUES ?`;

    const params = costsToInsert?.map((item) => [
      "9999",
      "29",
      "Colombia",
      item?.codeDaneOrigin == "" ? 0 : item.codeDaneOrigin,
      item?.ciudadOrigen,
      "Colombia",
      item?.codeDaneDestion == "" ? 0 : item.codeDaneDestion,
      item?.ciudadDestino,
      item?.tipoTrayecto,
      item?.flete,
      item?.tiempoEntrega,
      item?.tipoTrayecto,
      "2021/10/01",
      "2022/09/31",
      "20211001",
      "20220931",
      "1",
    ]);

    try {
      const responseInsert = await execQuery(queryInsert, params);
      return responseInsert;
    } catch (error) {
      console.log("insert:", error);
    }
  }

  async getCodeDaneCity() {
    const query = `SELECT DISTINCT(POBLACION) AS poblacion, dscodigodian AS codigoDane
                        FROM tblpaqueteo_ciudades_nacionales 
                        WHERE dscodigodian > 0`;

    try {
      const response = await execQuery(query);
      return response;
    } catch (error) {
      console.log("codeDane", error);
    }
  }
}

export default Cost;
