import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import PagerView from "react-native-pager-view";
import { CsvRow, Filters, useStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { loadPage, saveDone, savePage } from "@/db/db";

export default function PagerScreen() {
  const data = useStore((state) => state.data);
  const filters = useStore((state) => state.filters);
  const showHeaders = useStore((state) => state.cardSettings.showHeaders);
  const toggleDone = useStore((state) => state.toggleDone);
  const done = useStore((state) => state.done);
  const index = useStore((state) => state.cardIndex);
  const setIndex = useStore((state) => state.setCardIndex);

  const isDone = (rowIndex: number) => done[rowIndex] ?? false;

  // load index if saved
  useEffect(() => {
    const initPage = async () => {
      const savedPage = await loadPage();
      if (savedPage != null) {
        setIndex(savedPage);
      }
    };
    initPage();
  }, [setIndex]);

  const setIndexAndSave = (index: number) => {
    setIndex(index);
    savePage(index);
  };

  const toggleDoneAndSave = async () => {
    const savedPage = await loadPage();
    if (savedPage != null) {
      toggleDone(savedPage);
    }
    const latestDone = useStore.getState().done;
    saveDone(latestDone);
  };

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
          <PagerView
            style={styles.pagerView}
            initialPage={index}
            onPageSelected={(e) => setIndexAndSave(e.nativeEvent.position)}
          >
            {data &&
              data.rows.map((content, index) => (
                <Page
                  key={index}
                  content={content}
                  index={index}
                  filters={filters}
                  pageCount={data.rows.length}
                  showHeaders={showHeaders}
                  isDone={isDone(index)}
                  onPress={() => Keyboard.dismiss()}
                  onLongPress={() => toggleDoneAndSave()}
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
  showHeaders,
  isDone,
  onPress,
  onLongPress,
}: {
  content: CsvRow;
  index: number;
  filters: Filters;
  pageCount: number;
  showHeaders: boolean;
  isDone: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  const pageStyle = {
    ...styles.page,
    ...(isDone ? styles.cardGreenLeftBorder : styles.cardWhiteLeftBorder),
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={pageStyle}
      activeOpacity={1}
      onLongPress={onLongPress}
    >
      <View style={styles.card}>
        {Object.entries(content)
          .filter(([key, _]) => filters[key])
          .map((entry) => (
            <PageEntry
              index={index}
              key={entry[0]}
              entry={entry}
              showKey={showHeaders}
            />
          ))}
      </View>
      <View style={styles.pageIndexContainer}>
        <Text style={styles.pageIndex}>
          {index + 1} / {pageCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const PageEntry = ({
  index,
  entry,
  showKey,
}: {
  index: number;
  entry: [string, string];
  showKey: boolean;
}) => {
  const [key, value] = entry;
  return (
    <View style={{ flexDirection: "column", marginBottom: 5 }}>
      {showKey && <Text style={styles.header}>{key}</Text>}
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

  const textInputRef = useRef<TextInput>(null);

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (newValue: string) => {
    updateCell(index, column, newValue);
  };

  const value = (): string => {
    return cell(index, column);
  };

  const handleTextOnPress = () => {
    setIsEditing(true);
    // need a short delay to let it render the textinput..
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 100);
  };

  return (
    <View>
      {isEditing ? (
        <TextInput
          ref={textInputRef}
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
        <TouchableOpacity onPress={handleTextOnPress}>
          <Text style={styles.value}>{value()}</Text>
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
    borderLeftWidth: 0.5,
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "transparent", // Ensure no overriding color
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Android shadow
  },
  cardWhiteLeftBorder: {
    borderLeftColor: "white",
  },
  cardGreenLeftBorder: {
    borderLeftColor: "#39FF14",
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
