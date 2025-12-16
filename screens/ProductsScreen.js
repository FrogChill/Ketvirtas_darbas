import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ProductContext } from "../context/ProductContext";
import { AuthContext } from "../context/AuthContext";

export default function ProductsScreen({ navigation }) {
  const { products } = useContext(ProductContext);
  const { setUser, user } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Sandėlio prekės</Text>
          <Text style={styles.userInfo}>Darbuotojas: {user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Atsijungti</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.addButton]}
          onPress={() => navigation.navigate("Scanner", { action: "add" })}
        >
          <Text style={styles.actionButtonText}>+ Pridėti prekę</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => navigation.navigate("Scanner", { action: "remove" })}
        >
          <Text style={styles.actionButtonText}>− Pašalinti prekę</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.moveButton]}
          onPress={() => navigation.navigate("Scanner", { action: "move" })}
        >
          <Text style={styles.actionButtonText}>→ Perkelti prekę</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.outgoingButton}
        onPress={() => navigation.navigate("Outgoing")}
      >
        <Text style={styles.outgoingButtonText}>
          Peržiūrėti išvykusias prekes
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>
        Prekės sandėlyje ({products.length})
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>{item.quantity} vnt.</Text>
              </View>
            </View>
            
            <Text style={styles.productCode}>Kodas: {item.id}</Text>
            
            {item.description && (
              <Text style={styles.productDescription}>{item.description}</Text>
            )}
            
            <View style={styles.productFooter}>
              <Text style={styles.productMeta}>
                Įkelta: {new Date(item.createdAt).toLocaleDateString('lt-LT')}
              </Text>
              <Text style={styles.productMeta}>
                Darbuotojas: {item.addedBy}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sandėlis tuščias</Text>
            <Text style={styles.emptySubtext}>
              Nuskenuokite prekę, kad pridėtumėte
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  userInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#ff3b30",
    borderRadius: 6,
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#34C759",
  },
  removeButton: {
    backgroundColor: "#ff3b30",
  },
  moveButton: {
    backgroundColor: "#007AFF",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  outgoingButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#FF9500",
    borderRadius: 8,
    alignItems: "center",
  },
  outgoingButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 12,
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  quantityBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  productCode: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#333",
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
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 8,
  },
});