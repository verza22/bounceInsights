import axios from "axios";
import fs from "fs/promises";
import { API_NASA_URL } from "./../config";

export const fetchWithFallback = async (
  url: string,
  fallbackPath: string
): Promise<any> => {
  // try {
    const response = await axios.get(API_NASA_URL+url);
    return response.data;
  // } catch (error) {
  //   console.error(`Error fetching from API (${url}):`, error);
  //   console.warn(`Using fallback file: ${fallbackPath}`);
  //   return await readJSONFile(fallbackPath);
  // }
};

export const groupByRegion = (data: any[]) => {
    const getRegion = (location: string | null): string => {
      if (!location) return "Unknown";
      if (location.startsWith("N")) return "North";
      if (location.startsWith("S")) return "South";
      return "Unknown";
    };
  
    const grouped: Record<string, number> = {};
  
    data.forEach((item: any) => {
      const region = getRegion(item.sourceLocation || null);
      grouped[region] = (grouped[region] || 0) + 1;
    });
  
    return Object.entries(grouped).map(([name, y]) => ({ name, y }));
};


export const readJSONFile = async (path: string) => {
  try {
    const fileContent = await fs.readFile(path, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error leyendo o parseando JSON:", error);
    throw new Error("Archivo JSON inválido");
  }
};

export const validateLanguage = (lang: string) => {
  switch(lang){
    default:
      return "";
    case "es":
      return "ESP";
    case "en":
      return "ENG";
    case "de":
      return "DEU"
    case "fr":
      return "FRA"
    case "it":
      return "ITA"
    case "nl":
      return "NLD"
    case "ru":
      return "RUS"
  }
}