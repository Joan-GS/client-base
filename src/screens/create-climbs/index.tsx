import React, { useState, useCallback } from "react";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { Input, InputField } from "@/src/components/ui/input";
import { Button, ButtonText } from "@/src/components/ui/button";
import { TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { createClimb, CreateClimbRequest } from "./api/createClimbs";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast, Toast, ToastTitle } from "@/src/components/ui/toast";
import { useTranslation } from "react-i18next";

import {
  Container,
  Title,
  ErrorText,
  Label,
  TagsContainer,
  TagBadge,
  GradeBadge,
  StatusBadge,
  StyledTagsContainer,
} from "./styles";

import { CLIMBING_GRADE, STATUS, KILTER_TAGS } from "@joan16/shared-base";
import { BadgeText, useMediaQuery, VStack } from "@gluestack-ui/themed";

// Validation schema
const climbSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "* The title is too short")
    .required("* Title is required"),
  description: Yup.string().optional(),
  grade: Yup.string().required("* Grade is required"),
  tags: Yup.array().max(3, "Maximum 3 tags"),
});

const CreateClimbScreen = () => {
  const [selectedTags, setSelectedTags] = useState<KILTER_TAGS[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<STATUS>(STATUS.PUBLIC);
  const { t } = useTranslation();
  const toast = useToast();
  const [isMediumScreen] = useMediaQuery({ maxWidth: 768 });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(climbSchema),
    defaultValues: { title: "", description: "", grade: "", tags: [] },
  });

  // Function to toggle tags selection
  const toggleTag = useCallback(
    (tag: KILTER_TAGS) => {
      setSelectedTags((prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag)
          : prevTags.length < 3
          ? [...prevTags, tag]
          : prevTags
      );
    },
    [setSelectedTags]
  );

  // Function to show toast messages
  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action={type}>
            <ToastTitle>{t(message)}</ToastTitle>
          </Toast>
        ),
      });
    },
    [toast, t]
  );

  // Handle form submission
  const onSubmit = async (data: any) => {
    try {
      const climbData: CreateClimbRequest = {
        title: data.title,
        description: data.description || "",
        ratingAverage: 0,
        grade: data.grade,
        gradeAverage: data.grade,
        tags: selectedTags.map(String),
        status: selectedStatus,
        createdBy: "67de80abfdf66272446aad0e",
      };

      await createClimb(climbData);

      showToast("The climb was created successfully!", "success");

      reset();
      setSelectedTags([]);
      setSelectedStatus(STATUS.PUBLIC);
      router.replace("/dashboard/dashboard-layout");
    } catch (error) {
      showToast("Could not create the climb", "error");
    }
  };

  // Handle form validation errors
  const onError = () =>
    showToast("Please check the form fields and try again.", "error");

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Container>
        {isMediumScreen && <Title>{t("Set Boulder")}</Title>}{" "}
        {/* Title Input */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input isInvalid={!!errors.title}>
              <InputField
                placeholder={t("Title")}
                value={field.value}
                onChangeText={field.onChange}
              />
            </Input>
          )}
        />
        {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
        {/* Description Input */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input>
              <InputField
                placeholder={t("Description")}
                value={field.value}
                onChangeText={field.onChange}
              />
            </Input>
          )}
        />
        {/* Grade Selection */}
        <VStack>
          <Label>{t("Select Grade")}:</Label>
          <StyledTagsContainer>
            {Object.values(CLIMBING_GRADE).map((grade) => (
              <Controller
                key={grade}
                name="grade"
                control={control}
                render={({ field }) => (
                  <TouchableOpacity onPress={() => field.onChange(grade)}>
                    <GradeBadge selected={field.value === grade}>
                      <BadgeText>{grade}</BadgeText>
                    </GradeBadge>
                  </TouchableOpacity>
                )}
              />
            ))}
          </StyledTagsContainer>
          {errors.grade && <ErrorText>{errors.grade.message}</ErrorText>}
        </VStack>
        {/* Tag Selection */}
        <VStack>
          <Label>{t("Select up to 3 tags")}:</Label>
          <TagsContainer>
            {Object.values(KILTER_TAGS).map((tag) => (
              <TouchableOpacity key={tag} onPress={() => toggleTag(tag)}>
                <TagBadge
                  style={{
                    backgroundColor: selectedTags.includes(tag)
                      ? "#4CAF50"
                      : "#E0E0E0",
                  }}
                >
                  <BadgeText>{tag}</BadgeText>
                </TagBadge>
              </TouchableOpacity>
            ))}
          </TagsContainer>
        </VStack>
        {/* Status Selection */}
        <VStack>
          <Label>{t("Select Status")}:</Label>
          <TagsContainer>
            {Object.values(STATUS).map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
              >
                <StatusBadge
                  style={{
                    backgroundColor:
                      selectedStatus === status
                        ? status === STATUS.PUBLIC
                          ? "green"
                          : status === STATUS.DRAFT
                          ? "gray"
                          : "red"
                        : "#E0E0E0",
                  }}
                >
                  <BadgeText>{t(status)}</BadgeText>
                </StatusBadge>
              </TouchableOpacity>
            ))}
          </TagsContainer>
        </VStack>
        {/* Submit Button */}
        <VStack style={{ alignItems: "center", width: "100%", marginTop: 40 }}>
          <Button
            onPress={handleSubmit(onSubmit, onError)}
            isDisabled={isSubmitting}
          >
            <ButtonText>
              {isSubmitting ? t("Creating...") : t("Set Boulder")}
            </ButtonText>
          </Button>
        </VStack>
      </Container>
    </ScrollView>
  );
};

export const CreateClimb = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout title={t("Set Boulder")} isSidebarVisible>
        <CreateClimbScreen />
      </DashboardLayout>
    </SafeAreaView>
  );
};
