import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useStore } from "@/store/store";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton";
import { CheckboxRow } from "@/components/checkbox_row";
import { saveFilters } from "@/db/db";

export default function ColSelectionScreen() {
  const router = useRouter();

  const filters = useStore((state) => state.filters);
  const toggleFilter = useStore((state) => state.toggleFilter);

  const toggleFilterAndSave = (header: string) => {
    toggleFilter(header);

    const updatedFilters = useStore.getState().filters;
    saveFilters(updatedFilters);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.containerInScrollView}>
          <Text style={styles.header}>{"Select columns to show"}</Text>
          {Object.keys(filters).map((header) => (
            <CheckboxRow
              key={header}
              value={header}
              isChecked={(value) => filters[value]}
              toggleCheckbox={toggleFilterAndSave}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.startButton}>
        <MyButton title="Start" onPress={() => router.push("../pager")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },
  header: {
    color: "white",
    marginBottom: 50,
    fontSize: 20,
  },
  containerInScrollView: {
    flex: 1,
    flexDirection: "column",
    paddingBottom: 5,
    alignItems: "flex-start",
    width: "100%",
  },
  startButton: {
    bottom: 50,
  },
});
