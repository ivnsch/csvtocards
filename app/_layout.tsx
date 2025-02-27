import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Appearance } from "react-native";
import {
  loadCSV,
  loadDone,
  loadFilters,
  loadPage,
  loadTemplate,
} from "@/db/db";
import { useStore } from "@/store/store";
import { Drawer } from "expo-router/drawer";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const setData = useStore((state) => state.setData);
  const setFilters = useStore((state) => state.setFilters);
  const setDone = useStore((state) => state.setDone);
  const setCardIndex = useStore((state) => state.setCardIndex);
  const setTemplate = useStore((state) => state.setTemplate);

  // load db data into zusand
  useEffect(() => {
    const setFromCsv = async () => {
      const savedCsv = await loadCSV();
      if (savedCsv) {
        setData(savedCsv);
      }

      const savedFilters = await loadFilters();
      if (savedFilters) {
        setFilters(savedFilters);
      }

      const cardIndex = await loadPage();
      if (cardIndex) {
        setCardIndex(cardIndex);
      }

      const savedDone = await loadDone();
      if (savedDone) {
        setDone(savedDone);
      }

      const template = await loadTemplate();
      if (template) {
        setTemplate(template);
      }
    };
    setFromCsv();
  }, [setData]);

  useEffect(() => {
    Appearance.setColorScheme("dark");
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Drawer>
        <Drawer.Screen name="index" options={{ title: "Files" }} />
        <Drawer.Screen name="card_settings" options={{ title: "Settings" }} />
        <Drawer.Screen name="colselection" options={{ title: "Columns" }} />
        <Drawer.Screen name="pager" options={{ title: "Cards" }} />
      </Drawer>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
