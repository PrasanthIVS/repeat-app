import React from 'react'
import LottieView from 'lottie-react-native'

export const EmptyBoxAnimation = () => ( 
  // TODO: change variable name, refactor
  <LottieView
    source={require('../../../animations/5320-cardboard-box-open-loading-9')}
    autoPlay
    loop
  />
)

export const NotePadAnimation = () => (
  <LottieView
    source={require('../../../animations/5134-notepad-loading')}
    autoPlay
    loop
    speed={0.5}
  />
)

export const CheckMarkAnimation = () => (
  <LottieView
    source={require('../../../animations/1870-check-mark-done')}
    autoPlay
    loop={false}
  />
)

export const SimpleSpinner = () => (
  <LottieView
    source={require('../../../animations/simple-spinner')}
    autoPlay
    loop
  />
)