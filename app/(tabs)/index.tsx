import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import * as DocumentPicker from "expo-document-picker";
import * as Papa from "papaparse";

type CsvRow = {
  [key: string]: string; // Each row is an object with string keys and values
};

export default function HomeScreen() {
  const [data, setData] = useState<CsvRow[]>([]);

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
    } catch (error) {
      console.error("Error picking CSV file:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick CSV File" onPress={pickCSVFile} />
      <PagerView style={styles.pagerView} initialPage={0}>
        <View key="1">
          <Text style={styles.text}>First page</Text>
        </View>
        <View key="2">
          <Text style={styles.text}>Second page</Text>
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  text: {
    color: "white",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
