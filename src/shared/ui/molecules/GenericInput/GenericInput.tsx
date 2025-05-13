import { useState } from "react";
import { Controller, Control } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from "@/src/components/ui/form-control";
import {
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from "@/src/components/ui/input";
import { EyeIcon, EyeOffIcon } from "@/src/components/ui/icon";
import { InputWrapper } from "./styles";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  error?: string;
  isPasswordField?: boolean;
  [key: string]: any;
};

export const GenericControlledInput = ({
  control,
  name,
  label,
  placeholder,
  error,
  isPasswordField = false,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <InputWrapper>
            <Input {...props}>
              <InputField
                {...field}
                placeholder={placeholder}
                type={isPasswordField && !showPassword ? "password" : "text"}
              />
              {isPasswordField && (
                <InputSlot
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={{ paddingRight: 6 }}
                >
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              )}
            </Input>
          </InputWrapper>
        )}
      />

      {error && (
        <FormControlError>
          <FormControlErrorText>* {error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};
