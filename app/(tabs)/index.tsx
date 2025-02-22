import { Button, StyleSheet, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Papa from "papaparse";
import { CsvRow, useStore } from "@/store/store";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton";

export default function HomeScreen() {
  const router = useRouter();

  const setData = useStore((state) => state.setData);

  const pickCSVFile = async () => {
    let data = await getAndParseCsv();
    if (data) {
      setData(data);
      router.push("../colselection");
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

const getAndParseCsv = async (): Promise<CsvRow[] | undefined> => {
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

const getCsvAsString = async (): Promise<string | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "text/csv",
  });

  if (result.canceled) return null;

  const fileUri = result.assets[0].uri;
  const response = await fetch(fileUri);
  return await response.text();
};

const parseCsv = (csvString: string): CsvRow[] => {
  const parsed = Papa.parse<CsvRow>(csvString, { header: true });
  console.log("parsed: " + JSON.stringify(parsed));
  return parsed.data;
};
