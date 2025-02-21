import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import * as DocumentPicker from "expo-document-picker";
import * as Papa from "papaparse";
import { useCsvStore } from "@/store/store";
import { useRouter } from "expo-router";

type CsvRow = {
  [key: string]: string; // Each row is an object with string keys and values
};

export default function HomeScreen() {
  const router = useRouter();

  const setData = useCsvStore((state) => state.setData);

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
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Dark background
  },
  card: {
    width: "90%",
    padding: 20,
    // backgroundColor: "white",
    backgroundColor: "#1E1E1E", // Dark gray card

    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Android shadow
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
  },
  header: { color: "#999999" },
  cell: { flex: 1, padding: 8, textAlign: "center", color: "white" },

  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  value: {
    color: "#EAEAEA", // Light text for contrast
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    color: "#EAEAEA", // Light text for contrast
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
  pageIndex: {
    bottom: 20,
    right: 30, // Pushes it to the right
    textAlign: "right", // Ensures text alignment to the right
    position: "absolute",

    color: "#999999",
    fontSize: 16,
  },
  pageIndexContainer: {
    marginTop: 10,
    alignSelf: "flex-end", // Aligns it to the right inside the card
  },
});
