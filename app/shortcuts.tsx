import { StyleSheet, Text, View } from "react-native";

function Shortcuts() {
  const shortcuts = [
    { short: "↵ Enter", descr: 'Mark cards as "done"' },
    { short: "← → Arrows", descr: "Previous / next card " },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {shortcuts.map((s) => (
          <ShortcutEntry key={s.short} shortcut={s} />
        ))}
      </View>
    </View>
  );
}

const ShortcutEntry = ({ shortcut }: { shortcut: Shortcut }) => {
  return (
    <View style={styles.shortcut}>
      <Text style={styles.short}>{shortcut.short}:&nbsp;</Text>
      <Text style={styles.value}>{shortcut.descr}</Text>
    </View>
  );
};

type Shortcut = {
  short: string;
  descr: string;
};

export default Shortcuts;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 100,
  },
  wrapper: {
    alignItems: "flex-start",
  },
  shortcut: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
  },
  short: {
    color: "white",
    fontWeight: "bold",
  },
  value: {
    color: "white",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
});
