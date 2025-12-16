import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

export default function OutgoingProductsScreen({ navigation }) {
  const { outgoingProducts } = useContext(ProductContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Išvykusios prekės</Text>
        <Text style={styles.subtitle}>
          Iš viso: {outgoingProducts.length}
        </Text>
      </View>

      <FlatList
        data={outgoingProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{item.name}</Text>
            </View>
            
            <Text style={styles.productCode}>Kodas: {item.code}</Text>
            
            <View style={styles.productFooter}>
              <Text style={styles.productMeta}>
                Išvykimo data: {new Date(item.outDate).toLocaleDateString('lt-LT')} {new Date(item.outDate).toLocaleTimeString('lt-LT')}
              </Text>
              <Text style={styles.productMeta}>
                Perdavė: {item.handledBy}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nėra išvykusių prekių</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Grįžti atgal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  productCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productCode: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  productFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  productMeta: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "600",
  },
  backButton: {
    margin: 16,
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});