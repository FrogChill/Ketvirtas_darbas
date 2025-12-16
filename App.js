import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import ScannerScreen from "./screens/ScannerScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProductsScreen from "./screens/ProductsScreen";
import OutgoingProductsScreen from "./screens/OutgoingProductsScreen";
import AddProductDetailsScreen from "./screens/AddProductDetailsScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user } = useContext(AuthContext);
  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ title: "Prisijungimas" }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ title: "Registracija" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Products" 
            component={ProductsScreen}
            options={{ title: "Sandėlio prekės" }}
          />
          <Stack.Screen 
            name="Outgoing" 
            component={OutgoingProductsScreen}
            options={{ title: "Išvykusios prekės" }}
          />
          <Stack.Screen 
            name="Scanner" 
            component={ScannerScreen}
            options={{ title: "Skenuoti kodą" }}
          />
          <Stack.Screen 
            name="AddProductDetails" 
            component={AddProductDetailsScreen}
            options={{ title: "Prekės informacija" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ user }) => (
          <ProductProvider user={user}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ProductProvider>
        )}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}