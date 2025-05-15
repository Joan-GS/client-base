import {
  Modal as GluestackModal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/src/components/ui/modal";
import { CloseIcon } from "@gluestack-ui/themed";
import { Text } from "@/src/components/ui/text";
import { ReactNode } from "react";
import { GenericButton } from "@/src/shared/ui/atoms/GenericButton"; // Ajusta la ruta según tu estructura
import { Button } from "@/src/components/ui/button";
import { Icon } from "@/src/components/ui/icon";

type GenericModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footerContent?: ReactNode;
  closeOnOverlayClick?: boolean;
};

export const GenericModal = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
  closeOnOverlayClick = true,
}: GenericModalProps) => {
  return (
    <GluestackModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <ModalBackdrop />

      <ModalContent>
        <ModalCloseButton>
          <Button
            onPress={onClose}
            style={{
              backgroundColor: "transparent",
              position: "absolute",
              right: -20,
              top: -20,
            }}
          >
            <Icon as={CloseIcon} color="black" />
          </Button>
        </ModalCloseButton>
        {title && (
          <ModalHeader className="flex flex-row justify-between items-center">
            <Text className="text-lg font-semibold">{title}</Text>
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
        {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
      </ModalContent>
    </GluestackModal>
  );
};
