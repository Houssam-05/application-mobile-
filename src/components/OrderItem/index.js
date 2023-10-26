import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const OrderItem = ({ order, userLocation }) => {
  const navigation = useNavigation();
  if (userLocation)
    return (
      <View
        style={{
          flexDirection: "row",
          margin: 10,
          borderColor: "#3FC060",
          borderWidth: 2,
          borderRadius: 12,
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            width: "88.5%",
          }}
          onPress={() =>
            navigation.navigate("OrdersDeliveryScreen", { id: order.id })
          }
        >
          <Image
            source={{ uri: order.restaurant.image }}
            style={{
              width: "25%",
              height: "100%",
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
            }}
          />
          <View style={{ flex: 1, marginLeft: 10, paddingVertical: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              {order.restaurant.name}
            </Text>
            <Text style={{ color: "grey" }}>{order.restaurant.address}</Text>

            <Text
              style={{ fontWeight: "800", marginTop: 10, fontStyle: "italic" }}
            >
              Delivery Details:
            </Text>
            <Text style={{ fontWeight: "600" }}>{order.user}</Text>
            <Text style={{ color: "grey" }}>
              Location: '{userLocation.coords.latitude} ,{" "}
              {userLocation.coords.longitude}'
            </Text>
          </View>
        </Pressable>
      </View>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
