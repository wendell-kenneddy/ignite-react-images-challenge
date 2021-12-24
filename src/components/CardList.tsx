import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [currentImgUrl, setCurrentImgUrl] = useState('');

  const handleViewImage = (url: string): void => {
    setCurrentImgUrl(url);
    onOpen();
  };

  return (
    <>
      <SimpleGrid spacing="10" columns={3}>
        {cards.map(card => (
          <Card data={card} key={card.id} viewImage={handleViewImage} />
        ))}
      </SimpleGrid>

      <ModalViewImage
        isOpen={isOpen}
        onClose={onClose}
        imgUrl={currentImgUrl}
      />
    </>
  );
}
