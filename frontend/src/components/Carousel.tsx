import React from 'react';
import { Carousel, Image } from 'react-bootstrap';

const CustomCarousel: React.FC = () => {
  const slides = [
    {
      title: '30 Secongs',
      description:
        'Desafie seus amigos a reconher o nome das músicas ouvindo apenas um pequeno trecho.',
      color: '3498db',
    },
    {
      title: '30 Secongs',
      description: 'Crie uma sala, chame seus amigos e divirtam-se!',
      color: '3498db',
    },
    {
      title: '30 Secongs',
      description: 'Jogue imediatamente, gratuito e sem anúncios!',
      color: '3498db',
    },
  ];

  return (
    <Carousel
      className="mb-3 mt-3"
      controls={false}
      indicators={false}
      interval={3000}
      fade
    >
      {slides.map(({ title, description, color }) => (
        <Carousel.Item key={description}>
          <Image
            className="w-100 d-none d-md-block"
            src={`https://dummyimage.com/800x120/${color}/${color}`}
            alt={title}
            fluid
          />
          <Carousel.Caption>
            <h1>{title}</h1>
            <p>{description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CustomCarousel;
