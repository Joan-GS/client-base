import { Platform, Pressable, TextInput as RNTextInput } from "react-native";
import React, { useState } from "react";
import { Control, useController } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from "@/src/components/ui/form-control";
import { Input } from "@/src/components/ui/input";

type Props = {
  name: string;
  control: Control<any>;
  label: string;
  error?: string;
  [key: string]: any;
};

export const GenericDatePicker = ({
  name,
  control,
  label,
  error,
  ...props
}: Props) => {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const [showPicker, setShowPicker] = useState(false);

  const formattedDate =
    value instanceof Date
      ? value.toLocaleDateString()
      : value
      ? new Date(value).toLocaleDateString()
      : "";

  return (
    <FormControl isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>

      {Platform.OS === "web" ? (
        <Input>
          <input
            {...props}
            type="date"
            value={value ? new Date(value).toISOString().split("T")[0] : ""}
            onChange={(e) => onChange(new Date(e.target.value))}
            style={{
              padding: 10,
              width: "100%",
              border: "none",
              background: "transparent",
              color: value ? "inherit" : "#999",
            }}
          />
        </Input>
      ) : (
        <>
          <Pressable onPress={() => setShowPicker(true)}>
            <Input isReadOnly>
              <RNTextInput
                value={formattedDate}
                editable={false}
                pointerEvents="none"
                style={{ padding: 10 }}
              />
            </Input>
          </Pressable>

          {/* {showPicker && (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate?: Date) => {
                setShowPicker(false);
                if (selectedDate) onChange(selectedDate);
              }}
              maximumDate={new Date()}
            />
          )} */}
        </>
      )}

      {error && (
        <FormControlError>
          <FormControlErrorText>* {error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};
