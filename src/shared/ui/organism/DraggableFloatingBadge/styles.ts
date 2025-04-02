import { styled } from "@gluestack-style/react";
import { View } from "@gluestack-ui/themed";


export const FloatingBadge = styled(View, {
  position: "absolute",
  backgroundColor: "white",
  borderRadius: 20,
  padding: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
  zIndex: 4,
  flexDirection: "row",
  alignItems: "center",
  
});

export const DragHandle = styled(View, {
  marginRight: 8,
  opacity: 0.6,
});
