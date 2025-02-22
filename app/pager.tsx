import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useStore } from "@/store/store";

export default function PagerScreen() {
  const data = useStore((state) => state.data);
  const filters = useStore((state) => state.filters);

  return (
    <View style={styles.container}>
      <PagerView style={styles.pagerView} initialPage={0}>
        {data.map((content, index) => (
          <View key={index} style={styles.page}>
            <View style={styles.card}>
              {Object.entries(content)
                .filter(([key, _]) => filters[key])
                .map(([key, value]) => (
                  <View
                    key={key}
                    style={{ flexDirection: "column", marginBottom: 5 }}
                  >
                    <Text style={styles.header}>{key}</Text>
                    <Text style={styles.value}>{value}</Text>
                  </View>
                ))}
            </View>
            <View style={styles.pageIndexContainer}>
              <Text style={styles.pageIndex}>
                {index + 1} / {data.length}
              </Text>
            </View>
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Dark background
  },
  card: {
    width: "90%",
    padding: 20,
    // backgroundColor: "white",
    backgroundColor: "#1E1E1E", // Dark gray card

    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Android shadow
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
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
    color: "#EAEAEA", // Light text for contrast
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    color: "#EAEAEA", // Light text for contrast
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  pageIndex: {
    bottom: 20,
    right: 30, // Pushes it to the right
    textAlign: "right", // Ensures text alignment to the right
    position: "absolute",

    color: "#999999",
    fontSize: 16,
  },
  pageIndexContainer: {
    marginTop: 10,
    alignSelf: "flex-end", // Aligns it to the right inside the card
  },
});
