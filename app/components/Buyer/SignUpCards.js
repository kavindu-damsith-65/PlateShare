import React, { useRef, useEffect, useState } from "react";
import { ScrollView, Dimensions } from "react-native";
import SignUpCard from "./SignUpCard";

const SignUpCards = () => {
  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const cards = [
    {
      title: "Be a Hero, Deliver Hope!",
      description: "Join our mission to fight food waste and feed those in need.",
      buttonText: "Sign Up for Delivery",
      imageSource: require("../../assets/hand.jpg"),
    },
    {
      title: "Turn Surplus into Success!",
      description: "Partner with us to reduce food waste and make a difference.",
      buttonText: "Sign Up for Restaurant",
      imageSource: require("../../assets/restaurant.jpg"),
    },
  ];

  useEffect(() => {
    let scrollPosition = 0;
    const cardWidth = screenWidth - 30 + 32;
    const maxScroll = cardWidth * (cards.length - 1);

    const intervalId = setInterval(() => {
      if (isUserScrolling) return; // Skip auto-scroll if user is scrolling

      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
        scrollViewRef.current?.scrollTo({ x: 0, animated: true });
      } else {
        scrollPosition += cardWidth;
        scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true });
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isUserScrolling]);

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const cardWidth = screenWidth - 30 + 32;
    const currentIndex = Math.round(offsetX / cardWidth);
    const newOffset = currentIndex * cardWidth;

    if (offsetX !== newOffset) {
      scrollViewRef.current?.scrollTo({ x: newOffset, animated: true });
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      key="signUpCards"
      showsHorizontalScrollIndicator={false}
      horizontal
      className="pb-5"
      pagingEnabled
      onMomentumScrollEnd={handleMomentumScrollEnd}
      onScrollBeginDrag={() => setIsUserScrolling(true)}
      onScrollEndDrag={() => setIsUserScrolling(false)}
      decelerationRate="fast"
      snapToInterval={screenWidth - 30 + 32}
      snapToAlignment="center"
    >
      {cards.map((card, index) => (
        <SignUpCard
          key={index}
          title={card.title}
          description={card.description}
          buttonText={card.buttonText}
          imageSource={card.imageSource}
        />
      ))}
    </ScrollView>
  );
};

export default SignUpCards;
