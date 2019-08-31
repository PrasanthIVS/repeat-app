import React, { useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Button } from 'react-native-elements'
import { isNil } from 'ramda'

let myFunc

function startTime(time, setTime) {
  myFunc = setInterval(() => {
    setTime(time--)
  }, 1000)
}

// TODO: disable buttons conditionally based on pause/running
// TODO: clear styles

function timer(props) {
  const countdownTime = props.countdownTime
  const taskList = props.taskList
  const taskName = props.taskList.Sleep.taskName
  //   const repeatFreq = taskList.Sleep.repeatFreqency
  let [time, setTime] = useState(countdownTime)
  let [paused, pauseTimer] = useState(false)
  let [lap, setLap] = useState(1)

  const handleStartBtnTimer = () => {
    if (time === countdownTime && !paused) return startTime(time - 1, setTime) // (time - 2) sets 13 on function call
    if (time < countdownTime && paused) return startTime(time - 1, setTime)
  }

  const getStartButtonLabel = () => {
    if (time === countdownTime && !paused) return 'Start'
    if (time < countdownTime && paused) return 'Resume'
    if (time < countdownTime && !paused) return 'Running'
    return 'Start'
  }

  const disableRunning = () => time < countdownTime && !paused

  const disableClear = () => time === countdownTime && !paused

  const disablePause = () =>
    (time < countdownTime && paused) || time === countdownTime

  const resetAndClearRunningTimer = () => {
    if (lap === props.taskList.Sleep.repeatFrequency) {
      setTime(countdownTime)
      setLap(1)
      clearInterval(myFunc)
    } else if (lap <= props.taskList.Sleep.repeatFrequency) {
      setTime(countdownTime)
      setLap(lap + 1)
      clearInterval(myFunc)
      startTime(countdownTime - 1, setTime)
    } else {
      setTime(countdownTime)
      clearInterval(myFunc)
    }
  }

  const showFinishMsg = false
//   lap === props.taskList.Sleep.repeatFrequency && time === 1
  
  return (
    <View>
      <Text style={{ ...styles.points, fontSize: 25 }}>{`${taskName}`}</Text>
      <Text style={{ ...styles.points, fontSize: 25 }}>
        {!showFinishMsg
          ? `${lap} of ${props.taskList.Sleep.repeatFrequency}`
          : 'Finished!'}
      </Text>
      {time > 0 ? (
        <Text style={styles.points}>{`00 : 00 : ${
          `${time}`.length === 2 ? time : `0${time}`
        }`}</Text>
      ) : (
        resetAndClearRunningTimer()
      )}
      {/* <Text style={{ ...styles.points, fontSize: 25 }}>
        {paused
          ? 'paused'
          : (time < countdownTime ||
              lap <= props.taskList.Sleep.repeatFrequency) &&
            !paused
          ? 'running'
          : null}
      </Text> */}
      <View style={styles.iconStyle}>
        <Button
          icon={
            <Icon
              name="md-play"
              size={30}
              color={disableRunning() ? 'black' : 'green'}
            />
          }
          //   title={getLabel()}
          disabled={disableRunning()}
          onPress={() => {
            pauseTimer(false)
            // sets 14 initially without waiting for 1 sec
            // if (time === countdownTime) setTime(countdownTime - 1);
            handleStartBtnTimer()
          }}
          raised={true}
          type="clear"
        />
        <Button
          icon={
            <Icon
              name="md-refresh"
              size={30}
              color={disableClear() ? 'black' : 'green'}
            />
          }
          onPress={() => {
            pauseTimer(false)
            setTime(countdownTime)
            clearInterval(myFunc)
          }}
          disabled={disableClear()}
          type="clear"
        />
        <Button
          icon={
            <Icon
              name="md-pause"
              size={30}
              color={disablePause() ? 'black' : 'green'}
            />
          }
          onPress={() => {
            pauseTimer(true)
            clearInterval(myFunc)
          }}
          disabled={disablePause()}
          //   buttonStyle={styles.startButtonStyle}
          type="clear"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#3C3C3C',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  points: {
    textAlign: 'center',
    color: '#7591af',
    fontSize: 50,
    fontWeight: '100'
  },
  taskCount: {
    textAlign: 'center',
    color: '#7591af',
    fontSize: 20,
    fontWeight: '100'
  },
  iconStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
    // width: '20%'
  },
  startButtonStyle: {
    backgroundColor: '#00802b',
    borderRadius: 50,
    // borderWidth: 1,
    // width: "25%",
    borderColor: '#fff'
    // marginTop: 25
  }
})

export default timer
