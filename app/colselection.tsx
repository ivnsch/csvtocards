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
        behavior={Platform.OS === "ios" ? "position" : "height"}
        style={styles.keyboardWrapper}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
          //   contentContainerStyle={{ justifyContent: "flex-end", flex: 1 }}
        >
          <View style={styles.containerInScrollView}>
            <View style={styles.scrollViewNestedContent}>
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
    width: "100%",
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
    width: 200,
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
  scrollView: {
    width: "100%",
  },
  scrollViewContent: {
    paddingTop: 100,
    paddingBottom: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewNestedContent: {
    width: "100%",
  },
  keyboardWrapper: {
    flex: 1,
    width: "100%",
  },
});
