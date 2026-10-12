import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import FilterScreen from "./src/screens/FilterScreen";
import { MenuItem, RootStackParamList } from "./src/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

// The menu array lives here. It starts empty on purpose.
// Nothing is saved when the app closes (Part 2 does not need permanent storage).
export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  function addItem(item: MenuItem) {
    setMenuItems([...menuItems, item]);
  }

  function removeItem(id: string) {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#1B3A4B" },
          headerTintColor: "#F7F4EF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen name="Home" options={{ title: "Christoffel's Menu" }}>
          {(props) => (
            <HomeScreen
              {...props}
              menuItems={menuItems}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Filter" options={{ title: "Filter by Course" }}>
          {(props) => <FilterScreen {...props} menuItems={menuItems} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
