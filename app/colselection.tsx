import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useCsvStore } from "@/store/store";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function ColSelectionScreen() {
  const router = useRouter();

  const data = useCsvStore((state) => state.data);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const [checkedColumns, setCheckedColumns] = useState<{
    [key: string]: boolean;
  }>(
    Object.fromEntries(headers.map((header) => [header, true])) // Default: all checked
  );

  // Toggle checkbox state
  const toggleColumn = (header: string) => {
    setCheckedColumns((prev) => ({ ...prev, [header]: !prev[header] }));
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.headerRow}>
          <Text style={styles.header}>{"Select items to show"}</Text>
          {headers.map((header) => (
            <View key={header} style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => toggleColumn(header)}
                style={styles.checkbox}
              >
                {checkedColumns[header] ? (
                  <Text style={styles.checkmark}>✔</Text>
                ) : null}
              </TouchableOpacity>
              <Text style={styles.headerText}>{header}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Button
        onPress={async () => {
          router.push("../pager");
        }}
        title="Start"
        color="#841584"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: "white",
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flex: 1,
    flexDirection: "column",
    paddingBottom: 5,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    color: "#BB86FC",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  cell: { flex: 1, textAlign: "center", color: "#EAEAEA" },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "#BB86FC", fontSize: 20 },
});
