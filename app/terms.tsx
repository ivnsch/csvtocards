import { StyleSheet, Text, View } from "react-native";

const Terms = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms</Text>
      <Text style={styles.text}>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
        DEALINGS IN THE SOFTWARE.
      </Text>
    </View>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: 400,
    textAlign: "left",
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
