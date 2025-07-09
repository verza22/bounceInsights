import fs from "fs/promises";

export const readJSONFile = async (path: string) => {
  try {
    const fileContent = await fs.readFile(path, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error leyendo o parseando JSON:", error);
    throw new Error("Archivo JSON inválido");
  }
};