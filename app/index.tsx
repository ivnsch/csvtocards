import { StyleSheet, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Papa from "papaparse";
import { CsvRow, MyCsv, useStore } from "@/store/store";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { mockCsvData } from "@/mock/mockdata";
import { deleteCSV, saveCSV } from "@/db/db";

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const setData = useStore((state) => state.setData);

  const clearAllState = () => {
    // zustand
    setData(null);

    // storage
    deleteCSV();
  };

  const initCsv = (csv: MyCsv) => {
    clearAllState();

    setData(csv);
    saveCSV(csv);

    router.push("../colselection");
  };

  const pickCSVFile = async () => {
    let csv = await getAndParseCsv();
    // let data = mockCsvData;
    if (csv) {
      initCsv(csv);
    } else {
      // TODO error handling
      console.log("Couldn't parse any csv data");
    }
  };

  return (
    <View style={styles.container}>
      <MyButton title="Pick CSV File" onPress={pickCSVFile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: -100,
    justifyContent: "center",
  },
});

const getAndParseCsv = async (): Promise<MyCsv | undefined> => {
  try {
    const csvString = await getCsvAsString();
    if (csvString) {
      return parseCsv(csvString);
    } else {
      return;
    }
  } catch (error) {
    console.error("Error picking CSV file:", error);
    return;
  }
};

type ParsedCsvString = {
  fileName: string;
  csv: string;
};

const getCsvAsString = async (): Promise<ParsedCsvString | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "text/csv",
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  const fileUri = asset.uri;
  const fileName = asset.name;
  const response = await fetch(fileUri);
  const text = await response.text();
  return {
    fileName: fileName,
    csv: text,
  };
};

const parseCsv = (str: ParsedCsvString): MyCsv => {
  const parsed = Papa.parse<CsvRow>(str.csv, { header: true });
  console.log("parsed: " + JSON.stringify(parsed));
  const csvEntries = parsed.data;
  const headers = parsed.meta.fields || [];

  return new MyCsv(str.fileName, headers, parsed.data);
};
