import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";

const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  margin-top: 5rem; /* Added margin to push the slider down */
  @media (min-width: 768px) {
    padding: 2rem;
    margin-top: 8rem; /* Larger margin for larger screens */
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  min-width: 400px;
  @media (min-width: 768px) {
    min-height: 300px;
    min-width: 600px;
  }
  @media (min-width: 1024px) {
    min-height: 400px;
    min-width: 800px;
  }
`;

const Card = styled(motion.div)`
  position: absolute;
  width: 16rem;
  height: 16rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
  border: 2px solid white;
  background-size: cover;
  background-position: center;
  @media (min-width: 768px) {
    width: 24rem;
    height: 24rem;
    border-radius: 1.5rem;
    border-width: 4px;
  }
  @media (min-width: 1024px) {
    width: 32rem;
    height: 32rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 3.5rem; /* ⬅ Increased margin so buttons are lower */
  @media (min-width: 768px) {
    gap: 1rem;
    margin-top: 4rem; /* larger gap for bigger screens */
  }
`;

const Button = styled.button`
  border-radius: 9999px;
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: rgb(243 244 246);
  border: 1px solid rgb(229 231 235);
  cursor: pointer;
  transition: all 0.2s;
  color: rgb(55 65 81);
  &:hover {
    background-color: rgb(229 231 235);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
  }
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export default function CardCarousel({
  image1Url = "https://images.indianexpress.com/2024/02/punjab-medical-camp.jpg",
  image2Url = "https://picsum.photos/id/1018/600/600",
  image3Url = "https://picsum.photos/id/1019/600/600",
}) {
  const [currentIndex, setCurrentIndex] = useState(1);

  const cards = [
    { id: 1, image: image1Url },
    { id: 2, image: image2Url },
    { id: 3, image: image3Url },
  ];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const getCardStyles = (index) => {
    const position = (index - currentIndex + cards.length) % cards.length;
    const normalizedPosition =
      position > 1 ? position - cards.length : position;
    return {
      rotation: normalizedPosition * 5,
      zIndex: normalizedPosition === 0 ? 10 : 0,
      xPosition: `calc(${normalizedPosition} * (clamp(150px, 20vw, 250px)))`,
    };
  };

  return (
    <CarouselWrapper>
      <CarouselContainer
        role="region"
        aria-label="Image carousel"
        aria-roledescription="carousel"
      >
        {cards.map((card, index) => {
          const { rotation, zIndex, xPosition } = getCardStyles(index);
          return (
            <Card
              key={card.id}
              initial={false}
              animate={{
                x: xPosition,
                rotate: rotation,
                zIndex: zIndex,
                scale: index === currentIndex ? 1 : 0.9,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                backgroundImage: `url(${card.image})`,
              }}
              role="group"
              aria-label={`Slide ${index + 1} of ${cards.length}`}
              aria-hidden={index !== currentIndex}
            />
          );
        })}
      </CarouselContainer>
      <Controls>
        <Button onClick={goToPrevious} aria-label="Previous slide">
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button onClick={goToNext} aria-label="Next slide">
          <ChevronRight aria-hidden="true" />
        </Button>
      </Controls>
    </CarouselWrapper>
  );
}
