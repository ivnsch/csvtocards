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
  Image,
} from "react-native";
import PagerView from "react-native-pager-view";
import { CsvRow, Filters, useStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { loadPage, saveDone, savePage } from "@/db/db";
import ViewShot from "react-native-view-shot";
import { RightBar } from "@/components/rightbar";

export default function PagerScreen() {
  const data = useStore((state) => state.data);
  const filters = useStore((state) => state.filters);
  const showHeaders = useStore((state) => state.cardSettings.showHeaders);
  const toggleDone = useStore((state) => state.toggleDone);
  const done = useStore((state) => state.done);
  const index = useStore((state) => state.cardIndex);
  const setIndex = useStore((state) => state.setCardIndex);
  const template = useStore((state) => state.template);

  const isDone = (rowIndex: number) => done[rowIndex] ?? false;

  const viewShotRef = useRef<ViewShot>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pagerRef = useRef<PagerView | null>(null);

  // load index if saved
  useEffect(() => {
    ``;
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

  const captureScreenshot = async () => {
    if (viewShotRef.current) {
      const uri = await viewShotRef.current.capture({
        format: "png",
        quality: 0.9,
      });
      console.log("image url: " + uri);

      setImageUri(uri);
    }
  };

  const toggleDoneAndSave = async () => {
    const savedPage = await loadPage();
    if (savedPage != null) {
      toggleDone(savedPage);
    }
    const latestDone = useStore.getState().done;
    saveDone(latestDone);
  };

  useEffect(() => {
    if (pagerRef.current) {
      pagerRef.current.setPage(index);
    }
  }, [index]);

  return (
    <View style={styles.container}>
      <RightBar />
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
            ref={pagerRef}
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
                  onShare={captureScreenshot}
                  isDone={isDone(index)}
                  onPress={() => Keyboard.dismiss()}
                  onLongPress={() => toggleDoneAndSave()}
                  viewShotRef={viewShotRef}
                  template={template}
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
  onShare,
  isDone,
  onPress,
  onLongPress,
  viewShotRef,
  template,
}: {
  content: CsvRow;
  index: number;
  filters: Filters;
  pageCount: number;
  showHeaders: boolean;
  onShare: () => void;
  isDone: boolean;
  onPress: () => void;
  onLongPress: () => void;
  viewShotRef: React.RefObject<ViewShot>;
  template: string;
}) => {
  const customRows = parseTemplate(template, content);

  const cardStyle = {
    ...styles.card,
    ...(isDone ? styles.cardGreenLeftBorder : styles.cardWhiteLeftBorder),
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.page}
      activeOpacity={1}
      onLongPress={onLongPress}
    >
      <View style={styles.pageWrapper}>
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
          <View style={cardStyle}>
            <PageTopbar index={index} pageCount={pageCount} onShare={onShare} />

            {customRows ? (
              <TemplatePageEntry rows={customRows} />
            ) : (
              Object.entries(content)
                .filter(([key, _]) => filters[key])
                .map((entry) => (
                  <PageEntry
                    index={index}
                    key={entry[0]}
                    entry={entry}
                    showKey={showHeaders}
                  />
                ))
            )}
          </View>
        </ViewShot>
      </View>
    </TouchableOpacity>
  );
};

const parseTemplate = (layout: string, rowData: CsvRow): string[][] | null => {
  if (!layout) return null;

  return layout.split("\n").map((line) =>
    line.split(/\s+/).map((token) => {
      const match = token.match(/^\$(\w+)([.,!?:;]*)$/);
      if (match) {
        const columnName = match[1];
        const symbol = match[2];
        return (rowData[columnName] ?? `[${columnName} not found]`) + symbol;
      }
      return token;
    })
  );
};

const TemplatePageEntry = ({ rows }: { rows: string[][] }) => {
  return (
    <View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.customRow}>
          {row.map((cell, colIndex) => (
            <View key={colIndex}>
              <Text style={styles.value}>{cell}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
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

const PageTopbar = ({
  index,
  pageCount,
  onShare,
}: {
  index: number;
  pageCount: number;
  onShare: () => void;
}) => {
  return (
    <View style={styles.pageTopBar}>
      <CurrentPageIndicator index={index} pageCount={pageCount} />
      {/* <CameraButton onShare={onShare} /> */}
    </View>
  );
};

const CurrentPageIndicator = ({
  index,
  pageCount,
}: {
  index: number;
  pageCount: number;
}) => {
  return (
    <View style={styles.pageIndexContainer}>
      <Text style={styles.pageIndex}>
        {index + 1} / {pageCount}
      </Text>
    </View>
  );
};

const CameraButton = ({ onShare }: { onShare: () => void }) => {
  return (
    <TouchableOpacity onPress={() => onShare()} style={styles.cameraButton}>
      <Image
        style={styles.shareIcon}
        source={require("../assets/images/camera_button_grey.png")}
        resizeMode="contain"
      />
    </TouchableOpacity>
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 0.5,
  },
  pageWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  card: {
    flexDirection: "column",
    width: "80%",
    borderLeftWidth: 0.5,
    display: "flex",
    alignItems: "stretch",
    paddingLeft: 20,
  },
  shareIcon: {
    width: 25,
    height: 25,
    marginLeft: "auto",
    cursor: "pointer",
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
  valueText: {},
  customRow: {
    flexDirection: "row",
    gap: 10,
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
    color: "#999999",
    fontSize: 16,
  },
  pageTopBar: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  pageIndexContainer: {},
  editInput: {
    ...editInputBase,
  },
  cameraButton: {
    marginLeft: "auto",
  },
});
