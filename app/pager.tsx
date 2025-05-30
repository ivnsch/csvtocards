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
  Button,
  Animated,
} from "react-native";
import PagerView from "react-native-pager-view";
import { CsvRow, Filters, MyCsv, useStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { loadPage, saveCSV, saveDone, savePage } from "@/db/db";
import ViewShot from "react-native-view-shot";
import { RightBar } from "@/components/rightbar";
import { useNavigation } from "expo-router";
import RNFS from "react-native-fs";
import Share from "react-native-share";

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

  const navigation = useNavigation();
  const [showRightBar, setShowRightBar] = useState<boolean>(true);
  const rightBarSlideAnim = useRef(new Animated.Value(1)).current;
  const [rightBarPosition] = useState(new Animated.Value(-300));

  // animate right bar in/out
  useEffect(() => {
    if (showRightBar) {
      // animate in
      Animated.timing(rightBarPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // animate out
      Animated.timing(rightBarPosition, {
        toValue: 60,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showRightBar]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => downloadCsv()}
            style={{ marginRight: 10 }}
          >
            <Image
              source={require("../assets/images/upload.png")}
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Button title="☰" onPress={toggleRightBar} />
        </View>
      ),
    });
  }, [navigation]);

  const downloadCsv = async () => {
    const data = useStore.getState().data;
    if (data) {
      await downloadAsCSV(data);
    }
  };

  const toggleRightBar = () => {
    Animated.timing(rightBarSlideAnim, {
      toValue: showRightBar ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowRightBar((prev) => !prev);
  };

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
      <Animated.View
        style={[
          styles.rightBarWrapper,
          {
            transform: [{ translateX: rightBarPosition }],
          },
        ]}
      >
        <RightBar />
      </Animated.View>
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

const downloadAsCSV = async (data: MyCsv) => {
  const csvString = toString(data.rows);
  
  const path = await triggerDownload(data.name, csvString);
  if (path) {
    shareFile(path);
  }
};

const triggerDownload = async (
  fileName: string,
  csvContent: string
): Promise<string | null> => {
  const filePath =
    Platform.OS === "ios"
      ? RNFS.DocumentDirectoryPath + "/" + fileName
      : RNFS.ExternalDirectoryPath + "/" + fileName;

  try {
    await RNFS.writeFile(filePath, csvContent, "utf8");

    console.log("CSV file saved at: ", filePath);

    return filePath;
  } catch (error) {
    console.error("Error saving CSV file: ", error);
    return null;
  }
};

const shareFile = async (path: string) => {
  const options = {
    title: "Share CSV File",
    url: "file://" + path,
    type: "text/csv",
  };
  const res = await Share.open(options);
  console.log("share res: " + res);
};

const toString = (rows: CsvRow[]): string => {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeNewlines(row[h])).join(",")),
  ].join("\n");
};

// if we don't do this, multiple lines inside cells will appear as new rows
const escapeNewlines = (value: string) => {
  if (value.includes("\n")) {
    return `"${value}"`;
  }
  return value;
};

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
    const latestData = useStore.getState().data;
    if (latestData) {
      saveCSV(latestData);
    }
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
  rightBarWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: 60,
  },
});
