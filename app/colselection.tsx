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
        <View style={styles.headerRow}>
          <Text style={styles.header}>{"Select items to show"}</Text>
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
    <View key={header} style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => toggleFilter(header)}
        style={styles.checkbox}
      >
        {filters[header] ? <Text style={styles.checkmark}>✔</Text> : null}
      </TouchableOpacity>
      <Text style={styles.headerText}>{header}</Text>
    </View>
  );
};

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
