import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";


export default function LoginScreen({ navigation }) {
  const { login, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      setUser(res.user);
    } catch (err) {
      alert("Prisijungimo klaida");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prisijungimas</Text>

      <TextInput
        placeholder="El. paštas"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Slaptažodis"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Prisijungti" onPress={handleLogin} />

      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Register")}
      >
        Neturi paskyros? Registruotis
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10
  },
  link: { marginTop: 15, textAlign: "center", color: "blue" }
});
