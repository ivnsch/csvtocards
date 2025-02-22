import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Filters, useStore } from "@/store/store";
import { useRouter } from "expo-router";

export default function ColSelectionScreen() {
  const router = useRouter();

  const filters = useStore((state) => state.filters);
  const toggleFilter = useStore((state) => state.toggleFilter);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.containerInScrollView}>
          <Text style={styles.header}>{"Select columns to show"}</Text>
          {Object.keys(filters).map((header) => (
            <FilterRow
              key={header}
              header={header}
              filters={filters}
              toggleFilter={toggleFilter}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.startButton}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../pager")}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const FilterRow = ({
  header,
  filters,
  toggleFilter,
}: {
  header: string;
  filters: Filters;
  toggleFilter: (header: string) => void;
}) => {
  return (
    <View key={header} style={styles.filter}>
      <TouchableOpacity
        onPress={() => toggleFilter(header)}
        style={styles.checkbox}
      >
        {filters[header] ? <Text style={styles.checkmark}>✔</Text> : null}
      </TouchableOpacity>
      <Text style={styles.filterText}>{header}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },
  header: {
    color: "white",
    marginBottom: 50,
  },
  filter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 20,
  },
  containerInScrollView: {
    flex: 1,
    flexDirection: "column",
    paddingBottom: 5,
    alignItems: "flex-start",
    width: "100%",
  },
  filterText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginStart: 10,
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "#BB86FC", fontSize: 20 },
  startButton: {
    bottom: 50,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
