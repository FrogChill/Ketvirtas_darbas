import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { ProductContext } from "../context/ProductContext";

export default function AddProductDetailsScreen({ navigation, route }) {
  const { code, rawData } = route.params;
  const { addProduct } = useContext(ProductContext);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Klaida", "Prašome įvesti prekės pavadinimą");
      return;
    }

    setLoading(true);
    try {
      await addProduct(code, name.trim(), description.trim());
      Alert.alert(
        "Sėkmingai",
        "Prekė pridėta į sandėlį!",
        [
          {
            text: "Gerai",
            onPress: () => navigation.navigate("Products"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Klaida", `Nepavyko pridėti prekės: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check if the scanned data was a URL
  const isUrl = rawData !== code && rawData.startsWith('http');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Prekės informacija</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.label}>Prekės kodas:</Text>
            <Text style={styles.codeText}>{code}</Text>
            
            {isUrl && (
              <View style={styles.urlInfo}>
                <Text style={styles.urlLabel}>Nuskaitytas URL:</Text>
                <Text style={styles.urlText} numberOfLines={2}>{rawData}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pavadinimas *</Text>
            <TextInput
              style={styles.input}
              placeholder="Įveskite prekės pavadinimą"
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Aprašymas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Įveskite prekės aprašymą (neprivaloma)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Pridedama..." : "Pridėti prekę"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.navigate("Products")}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Atšaukti</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  codeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  urlInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#b3d9ff",
  },
  urlLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  urlText: {
    fontSize: 12,
    color: "#007AFF",
    fontStyle: "italic",
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#34C759",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});