import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "@/i18n";
import "../../global.css";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";
import { useColorScheme } from "../components/useColorScheme";
import { RecoilRoot } from "recoil";
import { StyledProvider } from "@gluestack-style/react";
import { customConfig } from "@/gluestack-style.config";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <RecoilRoot>
      <GluestackUIProvider mode={"light"}>
        <StyledProvider config={customConfig}>
          <ThemeProvider value={DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="signin" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="confirm-mail" initialParams={{ email: "" }} />
              <Stack.Screen name="verify-mail" initialParams={{ email: "", code: "" }} />
              <Stack.Screen name="forgot-password" />
              <Stack.Screen name="create-password" />
              <Stack.Screen name="dashboard" />
              <Stack.Screen name="news-and-feed"/>
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </StyledProvider>
      </GluestackUIProvider>
    </RecoilRoot>
  );
}
