import Utils from "../utils/index.js";
import xlsx from "xlsx";
import { execQuery } from "../../db/index.js";

class Time extends Utils {
  async readFile() {
    const book = await xlsx.readFile("./uploads/cost/TIEMPOSENVIA.ods");
    const sheet = await book.SheetNames;
    const data = await xlsx.utils.sheet_to_json(book.Sheets[sheet[0]]);
    const dataValidate = await this.validate(data);
    const response = await this.updateTime(dataValidate);

    return dataValidate;
  }
  async validate(data) {
    let toUpdate = [];

    for (let i = 0; i < data.length; i++) {
      let origen = data[i]["ORIGEN"];
      let destino = data[i]["DESTINO"];
      let tiempo = data[i]["TIEMPO"];
      data[i]["nuevoTiempo"] = tiempo;
      let response = await  this.validateJournei(origen, destino, tiempo);

      toUpdate.push(response)
    }
    // data.forEach((element) => {
    //   if(element.ORIGEN != "" && element.DESTINO != "" && element.TIEMPO != ""){
    //     this.validateJournei(
    //       element.ORIGEN,
    //       element.DESTINO,
    //       element.TIEMPO
    //     ).then((response) => {
    //       toUpdate.push(response);
    //     });
    //   }
    // });
    return toUpdate;
  }

  async validateJournei(origen, destino, tiempo) {
    const query = `SELECT id, dsciudadorigen, dsciudaddestino, dstiempoentrega
                            FROM tblproveedores_costos
                            WHERE idtransportadora = 29 AND dsciudadorigen LIKE '${origen}'
                            AND dsciudaddestino LIKE '${destino}' AND dstiempoentrega != ${tiempo} 
                            AND 20211201 BETWEEN idfechai and idfechaf order by id desc limit 0,1
        `;

    try {
      const response = execQuery(query);
      return response;
    } catch (error) {
      // console.log("err", error);
    }
  }
}

export default Time;
