import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import PagerView from "react-native-pager-view";
import { CsvRow, Filters, useStore } from "@/store/store";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";

export default function PagerScreen() {
  const navigation = useNavigation();

  const data = useStore((state) => state.data);
  const filters = useStore((state) => state.filters);

  useEffect(() => {
    navigation.setOptions({ title: "Cards" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <PagerView style={styles.pagerView} initialPage={0}>
            {data &&
              data.rows.map((content, index) => (
                <Page
                  key={index}
                  content={content}
                  index={index}
                  filters={filters}
                  pageCount={data.rows.length}
                />
              ))}
          </PagerView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const Page = ({
  content,
  index,
  filters,
  pageCount,
}: {
  content: CsvRow;
  index: number;
  filters: Filters;
  pageCount: number;
}) => {
  return (
    <View style={styles.page}>
      <View style={styles.card}>
        {Object.entries(content)
          .filter(([key, _]) => filters[key])
          .map((entry) => (
            <PageEntry index={index} key={entry[0]} entry={entry} />
          ))}
      </View>
      <View style={styles.pageIndexContainer}>
        <Text style={styles.pageIndex}>
          {index + 1} / {pageCount}
        </Text>
      </View>
    </View>
  );
};

const PageEntry = ({
  index,
  entry,
}: {
  index: number;
  entry: [string, string];
}) => {
  const [key, value] = entry;
  return (
    <View style={{ flexDirection: "column", marginBottom: 5 }}>
      <Text style={styles.header}>{key}</Text>
      <Value index={index} column={key} />
    </View>
  );
};

const Value = ({ index, column }: { index: number; column: string }) => {
  return <EditableValue index={index} column={column} />;
};

const EditableValue = ({
  index,
  column,
}: {
  index: number;
  column: string;
}) => {
  const cell = useStore((state) => state.cell);
  const updateCell = useStore((state) => state.updateCell);

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (newValue: string) => {
    updateCell(index, column, newValue);
  };

  const value = (): string => {
    return cell(index, column);
  };

  return (
    <View>
      {isEditing ? (
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          onChangeText={(text) => handleChange(text)}
          onBlur={() => setIsEditing(false)}
          value={value()}
          style={styles.editInput}
        />
      ) : (
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          style={styles.value}
        >
          <Text>{value()}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const editInputBase = {
  borderBottomWidth: 1,
  borderBottomColor: "white",
  backgroundColor: "transparent",
  color: "white",
  paddingVertical: 5,
  fontSize: 16,
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "#1E1E1E",

    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Android shadow
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
    color: "#EAEAEA",
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    color: "#EAEAEA",
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
  pageIndex: {
    bottom: 20,
    right: 30,
    textAlign: "right",
    position: "absolute",

    color: "#999999",
    fontSize: 16,
  },
  pageIndexContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  editInput: {
    ...editInputBase,
  },
});
