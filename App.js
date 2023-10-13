import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation";

import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";

LogBox.ignoreAllLogs();
export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="light" />
      </AuthProvider>
    </NavigationContainer>
  );
}
