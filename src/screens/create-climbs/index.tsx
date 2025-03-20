import React, { useState } from "react";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { Text } from "@/src/components/ui/text";
import { Input, InputField } from "@/src/components/ui/input";
import { Button, ButtonText } from "@/src/components/ui/button";
import { VStack } from "@/src/components/ui/vstack";
import { Alert } from "react-native";
import { router } from "expo-router";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { createClimb } from "./api/createClimbs";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";



// 📌 **Validaciones con Yup**
const climbSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "El título es muy corto")
    .required("Título requerido"),
  description: Yup.string().optional(),
  ratingAverage: Yup.number()
    .min(1, "Debe ser al menos 1")
    .max(5, "Máximo 5")
    .required("Calificación requerida"),
  grade: Yup.string().required("El grado es obligatorio"),
  gradeAverage: Yup.number()
    .min(1, "Debe ser al menos 1")
    .max(5, "Máximo 5")
    .required("Promedio de grado requerido"),
  tags: Yup.string().required("Debe ingresar al menos una etiqueta"),
});

const CreateClimbScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(climbSchema),
    defaultValues: {
      title: "",
      description: "",
      grade: "",
      tags: "",
    },
  });


  const onSubmit = async (data: any) => {
    try {
      const climbData = {
        ...data,
        ratingAverage: parseFloat(data.ratingAverage),
        gradeAverage: parseFloat(data.gradeAverage),
        tags: data.tags.split(",").map((tag: string) => tag.trim()),
        status: "open",
        createdBy: "67cf4d8251eb7a917c2f5543", // 🔹 ID de usuario (debería ser dinámico)
      };

      await createClimb(climbData);
      Alert.alert("¡Éxito!", "El climb se creó correctamente");
      reset(); // 🔄 Limpiar el formulario
      router.replace("/dashboard/dashboard-layout");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el climb");
    }
  };

  return (
    <VStack className="p-6 space-y-6">
      {" "}
      {/* 🎨 Agregamos separación entre elementos */}
      <Text className="text-2xl font-bold text-primary-800">Nuevo Climb</Text>
      {/* 🔹 Input: Título */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input isInvalid={!!errors.title}>
            <InputField
              placeholder="Título"
              value={field.value}
              onChangeText={field.onChange}
            />
          </Input>
        )}
      />
      {errors.title && (
        <Text className="text-red-500">{errors.title.message}</Text>
      )}
      {/* 🔹 Input: Descripción */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Input>
            <InputField
              placeholder="Descripción"
              value={field.value}
              onChangeText={field.onChange}
            />
          </Input>
        )}
      />
      {/* 🔹 Input: Grado */}
      <Controller
        name="grade"
        control={control}
        render={({ field }) => (
          <Input isInvalid={!!errors.grade}>
            <InputField
              placeholder="Grado"
              value={field.value}
              onChangeText={field.onChange}
            />
          </Input>
        )}
      />
      {errors.grade && (
        <Text className="text-red-500">{errors.grade.message}</Text>
      )}
      {/* 🔹 Input: Etiquetas */}
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <Input isInvalid={!!errors.tags}>
            <InputField
              placeholder="Etiquetas (separadas por coma)"
              value={field.value}
              onChangeText={field.onChange}
            />
          </Input>
        )}
      />
      {errors.tags && (
        <Text className="text-red-500">{errors.tags.message}</Text>
      )}
      {/* 🔹 Botón de enviar */}
      <Button onPress={handleSubmit(onSubmit)} isDisabled={isSubmitting}>
        <ButtonText>{isSubmitting ? "Creando..." : "Crear Climb"}</ButtonText>
      </Button>
    </VStack>
  );
};

export const CreateClimb = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout
        title="Crear Climb"
        isSidebarVisible={true}
        isHeaderVisible={false}
      >
        <CreateClimbScreen />
      </DashboardLayout>
    </SafeAreaView>
  );
};
