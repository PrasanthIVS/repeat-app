import React from 'react'
import { range } from 'ramda'
import ScrollPicker from 'react-native-wheel-scroll-picker'

const timeRange = {
  hours: range(0, 24),
  minutes: range(0, 60),
  seconds: range(0, 24)
}

const TimePicker = props =>
  Object.keys(timeRange).map((timerKey, index) => (
    <ScrollPicker
      key={index}
      dataSource={timeRange[timerKey]}
      selectedIndex={0}
      renderItem={(data, index, isSelected) => {
        //
      }}
      onValueChange={(data, selectedIndex) =>
        props.handleTimeChange(data, timerKey)
      }
      wrapperHeight={40}
      wrapperWidth={20}
      wrapperBackground={'#F5FCFF'}
      itemHeight={40}
      highlightBorderWidth={0}
      activeItemColor={'#222121'}
    />
  ))

export default TimePicker
