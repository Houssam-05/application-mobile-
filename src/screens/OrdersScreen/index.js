import { useRef, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import OrderItem from "../../components/OrderItem";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase.config";
const OrdersScreen = () => {
  const bottomSheetRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const { width, height } = useWindowDimensions();
  const snapPoints = useMemo(() => ["12%", "97%"], []);
  useEffect(() => {
    const fetchOrders = async () => {
      const orderRef = doc(collection(db, "confirmedOrder"), "zayd");
      //   const data = await getDoc(orderRef);
      //   let res = [];
      //   res.push({ ...data.data().res });
      //   setOrders(Object.values([...res][0]));
      onSnapshot(orderRef, (snap) => {
        let res = [];
        const { userLocation } = snap.data();
        res.push({ ...snap.data().res });
        setOrders(Object.values([...res][0]));
        setUserLocation(userLocation);
      });
    };

    fetchOrders();
  }, []);

  if (!orders && !userLocation) return <ActivityIndicator size={"large"} />;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{
          height,
          width,
        }}
        showsUserLocation
        followsUserLocation
      >
        {orders.map((order) => (
          <Marker
            key={order.id}
            title={order.restaurant.name}
            description={order.restaurant.address}
            coordinate={{
              latitude: order.restaurant.loc.latitude,
              longitude: order.restaurant.loc.longitude,
            }}
          >
            <View
              style={{
                backgroundColor: "green",
                padding: 5,
                borderRadius: 20,
              }}
            >
              <Entypo name="shop" size={24} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              letterSpacing: 0.5,
              paddingBottom: 5,
            }}
          >
            You're Online
          </Text>
          <Text style={{ letterSpacing: 0.5, color: "grey" }}>
            Available Orders: {orders.length}
          </Text>
        </View>
        <BottomSheetFlatList
          data={orders}
          renderItem={({ item }) => (
            <OrderItem order={item} userLocation={userLocation} />
          )}
        />
      </BottomSheet>
    </View>
  );
};

export default OrdersScreen;
