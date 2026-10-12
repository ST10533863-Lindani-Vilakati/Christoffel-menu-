import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COURSES, Course, MenuItem, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Home"> & {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  onRemoveItem: (id: string) => void;
};


export default function HomeScreen({
  navigation,
  menuItems,
  onAddItem,
  onRemoveItem,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState<Course>("Starters");
  const [priceText, setPriceText] = useState("");
  const [message, setMessage] = useState("");


  const bannerOpacity = useRef(new Animated.Value(0)).current;

  function showBanner(text: string) {
    setMessage(text);
    bannerOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(bannerOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(1600),
      Animated.timing(bannerOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function handleAddPress() {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const price = Number(priceText);

   
    if (trimmedName === "") {
      showBanner("Enter a dish name.");
      return;
    }
    if (trimmedDescription === "") {
      showBanner("Enter a description.");
      return;
    }
    if (priceText.trim() === "" || Number.isNaN(price) || price <= 0) {
      showBanner("Enter a price greater than 0.");
      return;
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: trimmedName,
      description: trimmedDescription,
      course: course,
      price: price,
    };

    onAddItem(newItem);
    setName("");
    setDescription("");
    setPriceText("");
    setCourse("Starters");
    showBanner(trimmedName + " added to the menu.");
  }

 
  const totalItems = menuItems.length;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <View>
            <Text style={styles.headerTitle}>Christoffel's Menu</Text>
            <Text style={styles.headerSub}>Tonight's dishes</Text>
          </View>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total menu items</Text>
          <Text style={styles.totalValue}>{totalItems}</Text>
        </View>

        <Animated.View style={[styles.banner, { opacity: bannerOpacity }]}>
          <Text style={styles.bannerText}>{message}</Text>
        </Animated.View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Add a dish</Text>

          <Text style={styles.label}>Dish name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Peri-peri prawns"
            placeholderTextColor="#8A8175"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Short description for guests"
            placeholderTextColor="#8A8175"
            multiline
          />

          <Text style={styles.label}>Course</Text>
          <View style={styles.chipRow}>
            {COURSES.map((option) => {
              const selected = option === course;
              return (
                <Pressable
                  key={option}
                  onPress={() => setCourse(option)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Image
                    source={
                      option === "Starters"
                        ? require("../../assets/starter.png")
                        : option === "Mains"
                        ? require("../../assets/main.png")
                        : require("../../assets/dessert.png")
                    }
                    style={styles.chipIcon}
                  />
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Price (R)</Text>
          <TextInput
            style={styles.input}
            value={priceText}
            onChangeText={setPriceText}
            placeholder="e.g. 145"
            placeholderTextColor="#8A8175"
            keyboardType="decimal-pad"
          />

          <Pressable style={styles.addButton} onPress={handleAddPress}>
            <Text style={styles.addButtonText}>+ Add item</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.filterButton}
          onPress={() => navigation.navigate("Filter")}
        >
          <Text style={styles.filterButtonText}>Filter by course</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Prepared menu</Text>
        {totalItems === 0 ? (
          <Text style={styles.emptyText}>
            No dishes yet. Add the first item above.
          </Text>
        ) : (
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <View style={styles.itemTop}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>R {item.price.toFixed(2)}</Text>
                </View>
                <Text style={styles.badge}>{item.course}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => onRemoveItem(item.id)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F4EF" },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    backgroundColor: "#1B3A4B",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  logo: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  headerTitle: { color: "#F7F4EF", fontSize: 22, fontWeight: "700" },
  headerSub: { color: "#C4A35A", fontSize: 14, marginTop: 2 },
  totalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 16, color: "#1B3A4B", fontWeight: "600" },
  totalValue: { fontSize: 28, color: "#1B3A4B", fontWeight: "800" },
  banner: {
    backgroundColor: "#1B3A4B",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  bannerText: { color: "#F7F4EF", textAlign: "center" },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B3A4B",
    marginBottom: 10,
  },
  label: { color: "#5C564E", marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E4DDD2",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FBF9F6",
    color: "#1B3A4B",
  },
  multiline: { minHeight: 72, textAlignVertical: "top" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4DDD2",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#FBF9F6",
  },
  chipSelected: { backgroundColor: "#1B3A4B", borderColor: "#1B3A4B" },
  chipIcon: { width: 18, height: 18, borderRadius: 4, marginRight: 6 },
  chipText: { color: "#1B3A4B", fontWeight: "600" },
  chipTextSelected: { color: "#F7F4EF" },
  addButton: {
    backgroundColor: "#2E7D6E",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    alignItems: "center",
  },
  addButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  filterButton: {
    borderWidth: 1,
    borderColor: "#1B3A4B",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  filterButtonText: { color: "#1B3A4B", fontWeight: "700" },
  emptyText: { color: "#8A8175", marginBottom: 12 },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  itemTop: { flexDirection: "row", justifyContent: "space-between" },
  itemName: { fontSize: 16, fontWeight: "700", color: "#1B3A4B", flex: 1 },
  itemPrice: { fontWeight: "700", color: "#B05C3A" },
  badge: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: "#F3E6C8",
    color: "#1B3A4B",
    overflow: "hidden",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: "700",
  },
  itemDescription: { color: "#5C564E", marginTop: 8 },
  removeButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#F4E4E0",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  removeText: { color: "#9B3A2F", fontWeight: "700" },
});
