import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COURSES, Course, MenuItem, RootStackParamList } from "../types";

type FilterChoice = "All" | Course;

type Props = NativeStackScreenProps<RootStackParamList, "Filter"> & {
  menuItems: MenuItem[];
};

// Second screen so the app can navigate away from Home.
// if / filter decides which dishes are shown.
export default function FilterScreen({ menuItems }: Props) {
  const [selected, setSelected] = useState<FilterChoice>("All");

  const choices: FilterChoice[] = ["All", ...COURSES];

  const visibleItems = menuItems.filter((item) => {
    if (selected === "All") {
      return true;
    }
    return item.course === selected;
  });

  return (
    <View style={styles.screen}>
      <Text style={styles.help}>
        Choose a course to show only those dishes.
      </Text>
      <View style={styles.chipRow}>
        {choices.map((choice) => {
          const active = choice === selected;
          return (
            <Pressable
              key={choice}
              onPress={() => setSelected(choice)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {choice}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.count}>
        Showing {visibleItems.length} item{visibleItems.length === 1 ? "" : "s"}
      </Text>

      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No dishes in this course yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.course} · R {item.price.toFixed(2)}
            </Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F4EF", padding: 16 },
  help: { color: "#5C564E", marginBottom: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: "#E4DDD2",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipActive: { backgroundColor: "#1B3A4B", borderColor: "#1B3A4B" },
  chipText: { color: "#1B3A4B", fontWeight: "600" },
  chipTextActive: { color: "#F7F4EF" },
  count: { color: "#1B3A4B", fontWeight: "700", marginBottom: 10 },
  empty: { color: "#8A8175", marginTop: 12 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: "700", color: "#1B3A4B" },
  meta: { color: "#B05C3A", marginTop: 4, fontWeight: "600" },
  description: { color: "#5C564E", marginTop: 6 },
});
