import { StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";

export default function HomeScreen() {
  return (
    <PagerView style={styles.pagerView} initialPage={0}>
      <View key="1">
        <Text style={styles.text}>First page</Text>
      </View>
      <View key="2">
        <Text style={styles.text}>Second page</Text>
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  text: {
    color: "white",
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
});
