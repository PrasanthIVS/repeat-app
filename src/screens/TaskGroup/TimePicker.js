import React from 'react'
import { range } from 'ramda'
import { Picker } from 'react-native-wheel-datepicker'

const timeRange = {
  hours: range(0, 24),
  minutes: range(0, 60),
  seconds: range(0, 60)
}

const format = range =>
  range.map(val => (`${val}`.length === 1 ? `0${val}` : `${val}`))

const TimePicker = props =>
  Object.keys(timeRange).map((timerKey, index) => (
    <Picker
      style={{ flex: 1, backgroundColor: 'transparent', height: 90 }}
      key={index}
      pickerData={format(timeRange[timerKey])}
      onValueChange={data => props.handleTimeChange(+data, timerKey)}
    />
  ))

export default TimePicker
