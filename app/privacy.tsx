import { StyleSheet, Text, View } from "react-native";

const Privacy = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy policy</Text>
      <Text style={styles.text}>
        CSV To Cards (the "App") respects your privacy. This Privacy Policy
        explains how we handle your information when you use the App.
      </Text>

      <Text style={styles.text}>1. No Data Collection</Text>

      <Text style={styles.text}>
        We do not collect, store, or process any personal data from users. The
        App does not require user accounts, track user activity, or collect any
        personally identifiable information.
      </Text>

      <Text style={styles.text}>2. Changes to This Policy</Text>

      <Text style={styles.text}>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on the Website.
      </Text>
      <Text style={styles.text}>
        By using this App, you acknowledge that you have read and understood
        this Privacy Policy.
      </Text>
    </View>
  );
};

export default Privacy;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: 400,
    textAlign: "left",
    color: "white",
    paddingTop: 100,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    color: "white",
  },
});
