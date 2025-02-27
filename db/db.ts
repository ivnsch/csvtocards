import { MyCsv } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveCSV = async (csv: MyCsv) => {
  try {
    const jsonValue = JSON.stringify(csv);
    await AsyncStorage.setItem("csvData", jsonValue);
  } catch (e) {
    console.error("Error saving CSV:", e);
  }
};

export const loadCSV = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("csvData");
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error loading CSV:", e);
    return null;
  }
};

export const deleteCSV = async () => {
  try {
    await AsyncStorage.removeItem("csvData");
  } catch (e) {
    console.error("Error deleting CSV:", e);
  }
};

export const savePage = async (csv: number) => {
  try {
    const jsonValue = JSON.stringify(csv);
    await AsyncStorage.setItem("page", jsonValue);
  } catch (e) {
    console.error("Error saving page:", e);
  }
};

export const loadPage = async (): Promise<number | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem("page");
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error loading page:", e);
    return null;
  }
};

export const deletePage = async () => {
  try {
    await AsyncStorage.removeItem("page");
  } catch (e) {
    console.error("Error deleting page:", e);
  }
};

export const saveDone = async (csv: boolean[]) => {
  try {
    const jsonValue = JSON.stringify(csv);
    await AsyncStorage.setItem("done", jsonValue);
  } catch (e) {
    console.error("Error saving done:", e);
  }
};

export const loadDone = async (): Promise<boolean[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem("done");
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error loading done:", e);
    return null;
  }
};

export const deleteDone = async () => {
  try {
    await AsyncStorage.removeItem("done");
  } catch (e) {
    console.error("Error deleting done:", e);
  }
};
