import { StyleSheet, View, Text, Button } from "react-native";
import { useCsvStore } from "@/store/store";
import { useRouter } from "expo-router";

export default function ColSelectionScreen() {
  const router = useRouter();

  const data = useCsvStore((state) => state.data);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <View style={styles.container}>
      {headers.map((header) => (
        <View key={header} style={{ flexDirection: "column", marginBottom: 5 }}>
          <Text style={styles.header}>{header}</Text>
        </View>
      ))}
      <Button
        onPress={async () => {
          router.push("../pager");
        }}
        title="Set prompt"
        color="#841584"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: "white",
  },
});
