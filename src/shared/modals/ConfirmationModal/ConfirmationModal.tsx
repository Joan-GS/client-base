import { Button, ButtonText } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { ReactNode } from "react";
import { GenericModal } from "../GenericModal";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationModalProps) => {
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footerContent={
        <>
          <Button variant="outline" onPress={onClose}>
            <ButtonText>{cancelText}</ButtonText>
          </Button>
          <Button variant="solid" onPress={onConfirm} className="ml-2">
            <ButtonText>{confirmText}</ButtonText>
          </Button>
        </>
      }
    >
      {typeof message === "string" ? (
        <Text className="text-sm">{message}</Text>
      ) : (
        message
      )}
    </GenericModal>
  );
};