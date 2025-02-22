import { StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { CsvRow, Filters, useStore } from "@/store/store";

export default function PagerScreen() {
  const data = useStore((state) => state.data);
  const filters = useStore((state) => state.filters);

  return (
    <View style={styles.container}>
      <PagerView style={styles.pagerView} initialPage={0}>
        {data.map((content, index) => (
          <Page
            key={index}
            content={content}
            index={index}
            filters={filters}
            pageCount={data.length}
          />
        ))}
      </PagerView>
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
            <PageEntry entry={entry} />
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

const PageEntry = ({ entry }: { entry: [string, string] }) => {
  const [key, value] = entry;
  return (
    <View key={key} style={{ flexDirection: "column", marginBottom: 5 }}>
      <Text style={styles.header}>{key}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
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
});
