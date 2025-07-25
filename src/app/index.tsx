import React from "react";
import { Button, ButtonText } from "@/src/components/ui/button";
import { router } from "expo-router";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { VStack } from "@/src/components/ui/vstack";
const index = () => {
  return (
    <SafeAreaView className="md:flex flex-col items-center justify-center md:w-full h-full">
      <VStack className="p-2 md:max-w-[440px] w-full" space="xl">
        {/* <Button
          onPress={() => {
            router.push("/auth/splash-screen");
          }}
        >
          <ButtonText>SplashScreen</ButtonText>
        </Button> */}
        <Button
          className="w-full"
          onPress={() => {
            router.push("/auth/signin");
          }}
        >
          <ButtonText>Sign in</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("/auth/signup");
          }}
        >
          <ButtonText>Sign up</ButtonText>
        </Button>
        {/* <Button
          onPress={() => {
            router.push("/auth/forgot-password");
          }}
        >
          <ButtonText>Forgot password</ButtonText>
        </Button> */}
        {/* <Button
          onPress={() => {
            router.push("/auth/create-password");
          }}
        >
          <ButtonText>Create password</ButtonText>
        </Button> */}
        <Button
          onPress={() => {
            router.push("/dashboard/dashboard-layout");
          }}
        >
          <ButtonText>Dashboard</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("/profile/profile");
          }}
        >
          <ButtonText>Profile</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("/search/search");
          }}
        >
          <ButtonText>Search</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("/auth/confirm-mail");
          }}
        >
          <ButtonText>Confirm Mail</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("/auth/verify-mail");
          }}
        >
          <ButtonText>Verify Mail</ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
};

export default index;
