import { Button, StyleSheet, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Papa from "papaparse";
import { useStore } from "@/store/store";
import { useRouter } from "expo-router";

type CsvRow = {
  [key: string]: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const setData = useStore((state) => state.setData);

  const pickCSVFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
      });

      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      const response = await fetch(fileUri);
      const text = await response.text();

      const parsed = Papa.parse<CsvRow>(text, { header: true });
      console.log("parsed: " + JSON.stringify(parsed));

      setData(parsed.data);

      router.push("../colselection");
    } catch (error) {
      console.error("Error picking CSV file:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Button title="Pick CSV File" onPress={pickCSVFile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
