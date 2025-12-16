import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ProductContext } from "../context/ProductContext";

export default function ScannerScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addProduct, removeProduct, moveToOutgoing } = useContext(ProductContext);
  
  // Get action from route params (add, remove, or move)
  const action = route.params?.action || "add";

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // Function to extract code from URL or return the raw data
  const extractCode = (data) => {
    try {
      // Check if it's a URL
      const url = new URL(data);
      
      // Try to extract code from various URL patterns
      // Pattern 1: Query parameter ?code=XXX or ?id=XXX
      const codeParam = url.searchParams.get('code') || 
                       url.searchParams.get('id') || 
                       url.searchParams.get('product');
      if (codeParam) return codeParam;
      
      // Pattern 2: Last segment of path (e.g., domain.com/products/12345)
      const pathSegments = url.pathname.split('/').filter(s => s);
      if (pathSegments.length > 0) {
        const lastSegment = pathSegments[pathSegments.length - 1];
        // Only use if it's alphanumeric (not just letters)
        if (/^[A-Za-z0-9_-]+$/.test(lastSegment)) {
          return lastSegment;
        }
      }
      
      // Pattern 3: Hash fragment (e.g., domain.com#12345)
      if (url.hash) {
        const hashValue = url.hash.substring(1); // Remove the #
        if (hashValue) return hashValue;
      }
      
      // If we can't extract a specific code, use the full URL as code
      return data;
    } catch (e) {
      // Not a URL, return as is
      return data;
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned || isProcessing) return;
    
    setScanned(true);
    setIsProcessing(true);
    
    // Extract the actual product code from URL or use raw data
    const productCode = extractCode(data);
    
    try {
      if (action === "add") {
        // Adding product - will ask for name and description
        navigation.navigate("AddProductDetails", { 
          code: productCode,
          rawData: data // Pass original data for reference
        });
        // Reset states when navigating
        setScanned(false);
        setIsProcessing(false);
      } else if (action === "remove") {
        await removeProduct(productCode);
        Alert.alert(
          "Sėkmingai", 
          `Prekė pašalinta!\nKodas: ${productCode}`, 
          [
            { 
              text: "Skaityti dar vieną", 
              onPress: () => {
                setScanned(false);
                setIsProcessing(false);
              }
            },
            { 
              text: "Baigti", 
              onPress: () => navigation.navigate("Products")
            },
          ],
          { cancelable: false }
        );
      } else if (action === "move") {
        await moveToOutgoing(productCode);
        Alert.alert(
          "Sėkmingai", 
          `Prekė perkelta į išvykusias!\nKodas: ${productCode}`, 
          [
            { 
              text: "Skaityti dar vieną", 
              onPress: () => {
                setScanned(false);
                setIsProcessing(false);
              }
            },
            { 
              text: "Baigti", 
              onPress: () => navigation.navigate("Products")
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      Alert.alert(
        "Klaida", 
        `Nepavyko atlikti operacijos: ${error.message || 'Nežinoma klaida'}`,
        [
          {
            text: "Gerai",
            onPress: () => {
              setScanned(false);
              setIsProcessing(false);
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  const handleGoBack = () => {
    navigation.navigate("Products");
  };

  const handleScanAgain = () => {
    setScanned(false);
    setIsProcessing(false);
  };

  const getTitle = () => {
    if (action === "add") return "Pridėti prekę";
    if (action === "remove") return "Pašalinti prekę";
    if (action === "move") return "Perkelti prekę";
    return "Skenuoti";
  };

  const getInstructions = () => {
    if (isProcessing) return "Apdorojama...";
    if (scanned) return "Laukiama...";
    if (action === "add") return "Nuskenuokite prekės kodą pridėjimui";
    if (action === "remove") return "Nuskenuokite prekės kodą pašalinimui";
    if (action === "move") return "Nuskenuokite prekės kodą perkėlimui";
    return "Nukreipkite kamerą į kodą";
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Prašoma kameros leidimo...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Reikalinga prieiga prie kameros
        </Text>
        <TouchableOpacity 
          style={styles.grantButton}
          onPress={requestPermission}
        >
          <Text style={styles.grantButtonText}>Suteikti leidimą</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Text style={styles.backButtonText}>Grįžti atgal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code128", "ean13", "ean8", "upc_a", "upc_e", "code39", "code93", "itf14", "pdf417", "aztec", "datamatrix"],
        }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.title}>{getTitle()}</Text>
        </View>
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Text style={styles.instructions}>{getInstructions()}</Text>
          <Text style={styles.subInstructions}>
            Palaikomi QR kodai, brūkšniniai kodai ir URL
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleGoBack}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      {scanned && !isProcessing && (
        <TouchableOpacity 
          style={styles.scanAgainButton}
          onPress={handleScanAgain}
        >
          <Text style={styles.scanAgainText}>Skaityti dar kartą</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    padding: 20,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  grantButton: {
    padding: 15,
    backgroundColor: "#34C759",
    marginHorizontal: 40,
    borderRadius: 8,
    marginBottom: 10,
  },
  grantButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    padding: 15,
    backgroundColor: "#007AFF",
    marginHorizontal: 40,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  middleRow: {
    flexDirection: "row",
    height: 250,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  scanArea: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#fff",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  instructions: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 8,
  },
  subInstructions: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  scanAgainButton: {
    position: "absolute",
    bottom: 50,
    left: 40,
    right: 40,
    padding: 15,
    backgroundColor: "#34C759",
    borderRadius: 8,
    alignItems: "center",
  },
  scanAgainText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});