import axios from "axios";
import { readJSONFile } from "./readJSONFile";

export const fetchWithFallback = async (
  url: string,
  fallbackPath: string
): Promise<any> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching from API (${url}):`, error);
    console.warn(`Using fallback file: ${fallbackPath}`);
    return await readJSONFile(fallbackPath);
  }
};