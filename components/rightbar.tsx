import { savePage } from "@/db/db";
import { useStore } from "@/store/store";
import { useEffect, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const RightBar = () => {
  const data = useStore((state) => state.data);
  const cardIndex = useStore((state) => state.cardIndex);
  const setCardIndex = useStore((state) => state.setCardIndex);
  const done = useStore((state) => state.done);

  const containerRef = useRef<View | null>(null);
  const listRef = useRef<FlatList | null>(null);

  const isDone = (rowIndex: number) => done[rowIndex] ?? false;

  const setIndexAndSave = (index: number) => {
    setCardIndex(index);
    savePage(index);
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToIndex({
        index: cardIndex,
        animated: true,
      });
    }
  }, [cardIndex]);

  return (
    <View ref={containerRef} style={styles.rightBar}>
      <FlatList
        ref={listRef}
        data={data?.rows}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <RowEntry
            index={index}
            highlighted={index === cardIndex}
            done={isDone(index)}
            onClick={() => setIndexAndSave(index)}
          />
        )}
        getItemLayout={(_, index) => ({
          length: 50, // Adjust based on row height
          offset: 50 * index, // Adjust based on row height
          index,
        })}
      />
    </View>
  );
};

const RowEntry = ({
  index,
  highlighted,
  done,
  onClick,
}: {
  index: number;
  highlighted: boolean;
  done: boolean;
  onClick: () => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.entry,
        ...(done && styles.entryDone),
      }}
      onPress={onClick}
    >
      <Text
        style={[
          styles.pageNumber,
          { color: highlighted ? "white" : "#333333" },
        ]}
      >
        {index + 1}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rightBar: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 50,
    height: "100%",
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    zIndex: 2,
    borderLeftWidth: 0.5,
    borderLeftColor: "gray",
  },
  entry: {
    width: "100%",
    borderBottomWidth: 0.5,
    borderBottomColor: "#333333",
    paddingLeft: 10,
    textAlign: "left",
    height: 50,
  },
  entryDone: {
    borderLeftWidth: 0.5,
    borderLeftColor: "#39FF14",
  },
  pageNumber: {
    fontSize: 20,
    color: "#333333",
  },
});
