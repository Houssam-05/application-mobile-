import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../screens/OrdersScreen";
import OrdersDeliveryScreen from "../screens/OrderDelivery";
import useAuthContext from "../hooks/useAuthContext";
import Profile from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { user } = useAuthContext();

  if (user)
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
        <Stack.Screen
          name="OrdersDeliveryScreen"
          component={OrdersDeliveryScreen}
        />
      </Stack.Navigator>
    );
  else
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileScreen" component={Profile} />
      </Stack.Navigator>
    );
};

export default Navigation;
