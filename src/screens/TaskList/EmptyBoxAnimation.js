import React from "react";
import LottieView from "lottie-react-native";

export default class EmptyBoxAnimation extends React.Component {
  render() {
    return (
      <LottieView
        source={require("../../../animations/5081-empty-box.json")}
        autoPlay
        loop
      />
    );
  }
}
