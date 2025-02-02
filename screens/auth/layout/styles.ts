import { styled } from "@gluestack-style/react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Image } from "@/components/ui/image";
import { View } from "@/components/ui/view";

export const SafeAreaContainer = styled(View, {
  width: "100%",
  height: "100%",
});

export const ScrollViewContainer = styled(ScrollView, {
  flexGrow: 1,
});

export const LayoutContainer = styled(View, {
  width: "100%",
  height: "100%",
  flexGrow: 1,
  justifyContent: "center",
  flexDirection: "row",
});

export const ImageContainer = styled(View, {
  position: "relative",
  top: 0,
  left: 0,
  width: "50%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
});

export const BackgroundImage = styled(Image, {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
});

export const ContentContainer = styled(View, {
  flex: 1,
  width: "100%",
  padding: 36,
  gap: 16,
  alignSelf: "center",
  height: "100%",
  zIndex: 1,
});