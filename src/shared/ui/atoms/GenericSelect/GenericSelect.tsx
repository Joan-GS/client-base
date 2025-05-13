import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/src/components/ui/select";
import { ChevronDownIcon } from "@/src/components/ui/icon";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from "@/src/components/ui/form-control";
import { useController, Control } from "react-hook-form";
import { StyledSelectTrigger } from "./styles";
import { PanelRightDashedIcon } from "lucide-react-native";

type Item = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  label: string;
  items: Item[];
  control?: Control<any>;
  setValue?: any;
  error?: string;
  variant?: any;
  size?: "sm" | "md" | "lg";
  [key: string]: any;
};

export const GenericSelect = ({
  name,
  label,
  items,
  control,
  setValue,
  error,
  variant = "outline",
  size = "md",
  ...props
}: Props) => {
  const {
    field: { value = "", onChange },
  } = useController({
    name,
    control,
    defaultValue: "",
  });

  const handleChange = (val: string) => {
    if (setValue) {
      setValue(name, val);
    } else {
      onChange(val);
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>

      <Select selectedValue={value} onValueChange={handleChange} {...props}>
        <StyledSelectTrigger variant={variant} size={size}>
          <SelectInput placeholder={label} />
          <SelectIcon as={ChevronDownIcon}/>
        </StyledSelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>

      {error && (
        <FormControlError>
          <FormControlErrorText>* {error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};
