import { useRouter } from "expo-router";
import { useStore } from "@/store/store";
import { CheckboxRow } from "@/components/checkbox_row";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { saveFilters } from "@/db/db";
import MyButton from "@/components/MyButton";

function CardSettingsView() {
  const settings = useStore((state) => state.cardSettings);
  const toggleShowHeaders = useStore((state) => state.toggleShowHeaders);

  const router = useRouter();

  const toggleShowHeadersAndSave = () => {
    toggleShowHeaders();
    saveSettings();
  };

  const saveSettings = () => {
    const updatedFilters = useStore.getState().filters;
    saveFilters(updatedFilters);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.containerInScrollView}>
          <Text style={styles.header}>{"Card settings"}</Text>
          <CheckboxRow
            key={"headers"}
            value={"Show headers"}
            isChecked={() => settings.showHeaders}
            toggleCheckbox={() => toggleShowHeadersAndSave()}
          />
        </View>
      </ScrollView>
      <View style={styles.startButton}>
        <MyButton
          title="Columns"
          onPress={() => router.push("../colselection")}
        />
      </View>
    </View>
  );
}

export default CardSettingsView;

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
