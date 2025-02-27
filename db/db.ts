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
