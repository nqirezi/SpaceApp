import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  RefreshControl,
  Animated,
} from "react-native";
import { Button } from "react-native-paper";
import { getAstronomyPictureOfTheDay } from "../api/nasaApi";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const HomeScreen = () => {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Fade animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animateFadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAstronomyPictureOfTheDay();
      if (data) {
        setApod(data);
        animateFadeIn();
      }
    } catch (err) {
      console.error("Error fetching APOD:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text>Please wait, we are loading picture of the day 😊...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>{apod?.title}</Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={{ uri: apod?.url }} style={styles.image} />
        </TouchableOpacity>

        <Text style={styles.date}>{apod?.date}</Text>
        <Text style={styles.description}>{apod?.explanation}</Text>
      </Animated.View>

      <Button
        icon={() => <Icon name="refresh" size={20} color="white" />}
        mode="contained"
        onPress={fetchData}
        style={styles.button}
      >
        Refresh the photo
      </Button>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalClose}
            >
              <Icon name="close" size={28} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: apod?.hdurl || apod?.url }}
              style={styles.fullImage}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  date: { fontSize: 16, color: "gray", marginBottom: 10 },
  image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 10 },
  description: { fontSize: 16, textAlign: "justify" },
  button: { marginTop: 20, backgroundColor: "#007aff" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    position: "relative",
  },
  fullImage: { width: "100%", height: "100%", resizeMode: "contain" },
  modalClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 30,
  },
});

export default HomeScreen;
