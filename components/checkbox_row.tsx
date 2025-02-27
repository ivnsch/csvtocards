import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const CheckboxRow = ({
  value,
  isChecked,
  toggleCheckbox,
}: {
  value: string;
  isChecked: (value: string) => boolean;
  toggleCheckbox: (value: string) => void;
}) => {
  return (
    <View key={value} style={styles.filter}>
      <TouchableOpacity
        onPress={() => toggleCheckbox(value)}
        style={styles.checkbox}
      >
        {isChecked(value) ? <Text style={styles.checkmark}>✔</Text> : null}
      </TouchableOpacity>
      <Text style={styles.filterText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  filter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 20,
  },
  filterText: {
    textAlign: "center",
    color: "white",
    marginLeft: 10,
    fontSize: 20,
  },
  checkbox: {
    display: "flex",
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "white", fontSize: 20 },
});
