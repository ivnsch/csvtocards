import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useStore } from "@/store/store";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton";
import { CheckboxRow } from "@/components/checkbox_row";
import { saveFilters } from "@/db/db";

export default function ColSelectionScreen() {
  const router = useRouter();

  const filters = useStore((state) => state.filters);
  const setTemplate = useStore((state) => state.setTemplate);
  const template = useStore((state) => state.template);

  const toggleFilter = useStore((state) => state.toggleFilter);

  const toggleFilterAndSave = (header: string) => {
    toggleFilter(header);

    const updatedFilters = useStore.getState().filters;
    saveFilters(updatedFilters);
  };

  const saveTemplate = async (layout: string) => {
    setTemplate(layout);
    await saveTemplate(layout);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.containerInScrollView}>
            <Text style={styles.header}>{"Default layout"}</Text>
            {Object.keys(filters).map((header) => (
              <CheckboxRow
                key={header}
                value={header}
                isChecked={(value) => filters[value]}
                toggleCheckbox={toggleFilterAndSave}
              />
            ))}
            <Separator />
            <Text style={styles.header}>Template</Text>
            <TextInput
              onChangeText={saveTemplate}
              value={template}
              multiline
              style={styles.textarea}
              placeholder="$SomeColumn foo $AnotherColumn"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.startButton}>
        <MyButton title="Start" onPress={() => router.push("../pager")} />
      </View>
    </TouchableOpacity>
  );
}

const Separator = () => {
  return (
    <View style={styles.separatorContainer}>
      <View style={styles.leftLine} />
      <Text style={styles.text}>OR</Text>
      <View style={styles.rightLine} />
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
    marginBottom: 20,
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
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10, // Adjust as needed
  },
  leftLine: {
    flex: 1,
    height: 1,
    backgroundColor: "gray",
    marginRight: 10,
  },
  rightLine: {
    flex: 1,
    height: 1,
    backgroundColor: "gray",
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  textarea: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "black",
    color: "white",
    width: "100%",
  },
});
