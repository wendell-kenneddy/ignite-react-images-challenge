import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  ModalCloseButton,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay>
        <ModalContent maxW={900} maxH={600}>
          <ModalBody p={0}>
            <Image
              src={imgUrl}
              alt="Imagem selecionada"
              objectFit="cover"
              w="max"
              h="max"
              maxW={900}
              maxH={600}
              borderTopRadius="md"
            />
          </ModalBody>

          <ModalFooter bgColor="pGray.800">
            <Link href={imgUrl} isExternal>
              Abrir original
            </Link>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
