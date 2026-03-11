import { StageData } from "./types";

export const STAGES: StageData[] = [
  {
    id: "home",
    title: "1. En Casa",
    subtitle: "Separación en la Fuente",
    description:
      "Todo comienza en tu hogar en Bucaramanga. Separa tus residuos usando el código de colores: Blanco (Aprovechables), Negro (No aprovechables) y Verde (Orgánicos).",
    position: [0, 0, 0],
    cameraPosition: [0, 5, 10],
    cameraTarget: [0, 0, 0],
  },
  {
    id: "public",
    title: "2. Universidad y Trabajo",
    subtitle: "Puntos Ecológicos",
    description:
      "En la UIS, UPB, UNAB o en tu oficina, busca los puntos ecológicos. Deposita cada residuo en su caneca correspondiente para facilitar el trabajo de los recicladores.",
    position: [20, 0, 0],
    cameraPosition: [20, 5, 10],
    cameraTarget: [20, 0, 0],
  },
  {
    id: "collection",
    title: "3. Recolección",
    subtitle: "Rutas y Cooperativas",
    description:
      "Las cooperativas de recicladores de Bucaramanga (como Bello Renacer o Coopreser) y los camiones de recolección recogen el material separado para llevarlo a las ECA (Estaciones de Clasificación).",
    position: [40, 0, 0],
    cameraPosition: [40, 5, 10],
    cameraTarget: [40, 0, 0],
  },
  {
    id: "processing",
    title: "4. Transformación",
    subtitle: "Plantas de Procesamiento",
    description:
      "El material recuperado se clasifica, se compacta y se envía a la industria para convertirse en nuevos productos, cerrando el ciclo y evitando que lleguen al relleno sanitario El Carrasco.",
    position: [60, 0, 0],
    cameraPosition: [60, 5, 10],
    cameraTarget: [60, 0, 0],
  },
];
