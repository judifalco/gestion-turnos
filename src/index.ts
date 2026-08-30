import { leerTurnos } from "./fileServices.js";

async function main() {
  try {
    const datos = await leerTurnos();
    console.log("Datos leídos:", datos);
  } catch (error) {
    console.error("Fallo en main:", error);
  }
}

main();