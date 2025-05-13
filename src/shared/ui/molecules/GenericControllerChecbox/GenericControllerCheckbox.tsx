import { Controller, Control } from "react-hook-form";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/src/components/ui/checkbox";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
} from "@/src/components/ui/form-control";
import { CheckIcon } from "@/src/components/ui/icon";
import { CheckboxContainer } from "./styles";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  defaultValue?: boolean;
  error?: string;
  [key: string]: any;
};

export const GenericControlledCheckbox = ({
  control,
  name,
  label,
  error,
  defaultValue = false,
  ...props
}: Props) => (
  <FormControl isInvalid={!!error}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <CheckboxContainer>
          <Checkbox value={name} isChecked={value} onChange={onChange} {...props}>
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>{label}</CheckboxLabel>
          </Checkbox>
        </CheckboxContainer>
      )}
    />
    {error && (
      <FormControlError>
        <FormControlErrorText>* {error}</FormControlErrorText>
      </FormControlError>
    )}
  </FormControl>
);
