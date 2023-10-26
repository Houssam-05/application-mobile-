import { useRef, useMemo, useEffect, useState, useReducer } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import styles from "./styles";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import useAuthContext from "../../hooks/useAuthContext";

const OrderDelivery = () => {
  const { user: driver } = useAuthContext();
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [isDriverClose, setIsDriverClose] = useState(false);
  const [order, setOrder] = useState([]);
  const [filteredOrder, setFilteredOrder] = useState([]);
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [deliveryStatus, setDeliveryStatus] = useState({
    accepted: false,
    pickedup: false,
  });

  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Please enable GPS to continue using the app."
        );
      } else {
        // Location permission granted, fetch user's location here
        getLocation();
      }
    };

    const getLocation = async () => {
      try {
        let location = await Location.getCurrentPositionAsync({});

        setDriverLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.log("Error fetching location:", error.message);
      }
    };

    // Call the function to request location permission when the component mounts
    requestLocationPermission();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const orderRef = doc(collection(db, "confirmedOrder"), "zayd");
      const data = await getDoc(orderRef);
      let res = [];
      // this need a modification it is for one user manually
      const { userLocation } = data.data();
      res.push({ ...data.data().res });
      let _result = Object.values([...res][0]).filter(
        (order) => order.id !== id
      );
      let result = Object.values([...res][0]).filter(
        (order) => order.id === id
      );
      setOrder(result[0]);
      setFilteredOrder(_result);
      setUserLocation(userLocation);
    };
    fetchOrders();
  }, [id]);
  const filterorder = () => {
    const orderRef = doc(collection(db, "confirmedOrder"), "zayd");
    setDoc(
      orderRef,
      { res: { ...filteredOrder }, userLocation },
      { merge: true }
    );
  };
  const restaurantLocation = {
    latitude: order?.restaurant?.loc.latitude,
    longitude: order?.restaurant?.loc.longitude,
  };

  const deliveryLocation = {
    latitude: userLocation?.coords.latitude,
    longitude: userLocation?.coords.longitude,
  };

  const onButtonpressed = () => {
    bottomSheetRef.current?.collapse();
    mapRef.current.animateToRegion({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setDeliveryStatus((prv) => ({ ...prv, accepted: true }));
    if (deliveryStatus.accepted) {
      bottomSheetRef.current?.collapse();
      setDeliveryStatus((prv) => ({ ...prv, pickedup: true }));
    }
    if (deliveryStatus.accepted && deliveryStatus.pickedup) {
      bottomSheetRef.current?.collapse();
      deliveredOrder();
      filterorder();
      navigation.goBack();
    }
  };

  const renderButtonTitle = () => {
    if (!deliveryStatus.accepted && !deliveryStatus.pickedup) {
      return "Accept Order";
    } else if (deliveryStatus.accepted && !deliveryStatus.pickedup) {
      return "Pick-Up Order";
    } else if (deliveryStatus.accepted && deliveryStatus.pickedup) {
      return "Complete Delivery";
    }
  };

  const deliveredOrder = async () => {
    const ref = collection(db, `deliveryGuy/${driver.uid}/deliveredOrder`);
    await setDoc(doc(ref, order.id), { ...order });
  };

  if (!order || !driverLocation || !userLocation)
    return <ActivityIndicator size={"large"} />;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={{ width, height }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation?.latitude,
          longitude: driverLocation?.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      >
        <MapViewDirections
          origin={driverLocation}
          destination={
            deliveryStatus.accepted && !deliveryStatus.pickedup
              ? restaurantLocation
              : deliveryLocation
          }
          strokeWidth={10}
          waypoints={
            deliveryStatus.accepted && !deliveryStatus.pickedup
              ? [restaurantLocation]
              : [deliveryLocation]
          }
          strokeColor="#3FC060"
          apikey={"AIzaSyC5byOLveBi1i-grnKZB_Prx9tyBX7Bzns"}
          onReady={(result) => {
            setIsDriverClose(result.distance <= 0.1);
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />
        <Marker
          coordinate={{
            latitude: order.restaurant.loc.latitude,
            longitude: order.restaurant.loc.longitude,
          }}
          title={order.restaurant.name}
          description={order.restaurant.address}
        >
          <View
            style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}
          >
            <Entypo name="shop" size={30} color="white" />
          </View>
        </Marker>

        <Marker
          coordinate={{
            latitude: userLocation?.coords.latitude,
            longitude: userLocation?.coords.longitude,
          }}
          title={order.user}
        >
          <View
            style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}
          >
            <MaterialIcons name="restaurant" size={30} color="white" />
          </View>
        </Marker>
      </MapView>
      <Ionicons
        onPress={() => navigation.goBack()}
        name="arrow-back-circle"
        size={45}
        color="black"
        style={{ top: 40, left: 15, position: "absolute" }}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.handleIndicatorContainer}>
          <Text style={styles.routeDetailsText}>
            {totalMinutes.toFixed(0)} min
          </Text>
          <FontAwesome5
            name="shopping-bag"
            size={30}
            color="#3FC060"
            style={{ marginHorizontal: 10 }}
          />
          <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} km</Text>
        </View>
        <View style={styles.deliveryDetailsContainer}>
          <Text style={styles.restaurantName}>{order.restaurant?.name}</Text>
          <View style={styles.adressContainer}>
            <Fontisto name="shopping-store" size={22} color="grey" />
            <Text style={styles.adressText}>{order.restaurant?.address}</Text>
          </View>

          <View style={styles.adressContainer}>
            <FontAwesome5 name="map-marker-alt" size={30} color="grey" />
            <Text style={styles.adressText}>
              {userLocation?.coords.latitude} , {""}{" "}
              {userLocation?.coords.longitude}
            </Text>
          </View>

          <View style={styles.orderDetailsContainer}>
            <Text style={styles.orderItemText}>
              {order?.name} x{order?.quantity}
            </Text>
          </View>
        </View>
        <Pressable
          style={{
            ...styles.buttonContainer,
            backgroundColor: "#3FC060",
          }}
          onPress={onButtonpressed}
        >
          <Text style={styles.buttonText}>{renderButtonTitle()}</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
};

export default OrderDelivery;
