import React, { useState } from 'react'
import { Text, View, StyleSheet, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { pathOr, isEmpty } from 'ramda'
import { updateTaskStatus, deleteTask } from '../../store/actions/tasks'

let myFunc
const showFinishMsg = false
function startTime(time, setTime) {
  myFunc = setInterval(() => {
    setTime(time = time-1000)
  }, 1000)
}

const getCountdownTimeInMs = lagTime => {
  const { hours, minutes, seconds } = lagTime
  return +hours * 3600000 + +minutes * 60000 + +seconds * 1000
}

// TODO: disable buttons conditionally based on pause/running
// TODO: clear styles
// TODO: default values
// TODO: edit functionality

function timer(props) {
  const { taskList, onToggleSwitch, changeBorderColor } = props
  const taskName = Object.keys(taskList)[0]
  const lagTime = taskList[taskName].lagTime
  const countdownTime = getCountdownTimeInMs(lagTime)
  const repeatFreq = taskList[taskName].repeatFrequency
  const taskRunning = taskList[taskName].taskRunning

  let [time, setTime] = useState(countdownTime)
  let [paused, pauseTimer] = useState(false)
  let [lap, setLap] = useState(1)
  let [showFinishMsg, updateFinishMsgStatus] = useState(false)

  const handleStart = () => {
    updateFinishMsgStatus(false)
    changeBorderColor('#3879D9')
    pauseTimer(false)
    !taskRunning && onToggleSwitch(taskList[taskName])
    if (time === countdownTime && !paused) return startTime(time, setTime) // (time - 2) sets 13 on function call
    if (time < countdownTime && paused) return startTime(time, setTime)
  }

  const handleClear = () => {
    pauseTimer(false)
    setLap(1)
    setTime(countdownTime)
    clearInterval(myFunc)
    taskRunning && onToggleSwitch(taskList[taskName])
  }

  const handlePause = () => {
    pauseTimer(true)
    clearInterval(myFunc)
  }

  // TODO: task delete variable names

  const handleDelete = () => {
    clearInterval(myFunc)
    // TODO: locale
    Alert.alert(
      'Are you sure you want to delete the task?',
      '',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => props.deleteTaskFromState(taskName)},
      ],
    );
  }

  const displayTime = () => {
    const roundedHrs = Math.floor(time / 3600000)
    const hours = `${roundedHrs}`.length === 1 ? `0${roundedHrs}` : roundedHrs
    const roundedMins = Math.floor(time / 60000)-(roundedHrs*60)
    const minutes =
      `${roundedMins}`.length === 1 ? `0${roundedMins}` : roundedMins
    const roundedSecs = Math.floor(time/1000)-(roundedHrs*3600)-(roundedMins*60)
    const seconds =
      `${roundedSecs}`.length === 1 ? `0${roundedSecs}` : roundedSecs
    return `${hours} : ${minutes} : ${seconds}`
  }

  const getStartButtonLabel = () => {
    if (time === countdownTime && !paused) return 'Start'
    if (time < countdownTime && paused) return 'Resume'
    if (time < countdownTime && !paused) return 'Running'
    return 'Start'
  }

  const disableRunning = () => taskRunning && !paused

  const disableClear = () => !taskRunning

  const disablePause = () => paused || !taskRunning

  const resetAndClearRunningTimer = () => {
    if (lap === repeatFreq) {
      setTime(countdownTime)
      setLap(1)
      clearInterval(myFunc)
      changeBorderColor('#6A9955')
      return setTimeout(() => {
        onToggleSwitch(taskList[taskName])
        updateFinishMsgStatus(true)
      }, 500)
    } else if (lap <= repeatFreq) {
      setTime(countdownTime)
      repeatFreq !== lap && setLap(lap + 1)
      repeatFreq - lap === 1 && changeBorderColor('#EE1628')
      clearInterval(myFunc)
      return startTime(countdownTime, setTime)
    } else {
      // showFinishMsg = true
      setTime(countdownTime)
      return clearInterval(myFunc)
    }
  }

  return (
    <View>
      <Text
        style={{ ...styles.points, fontSize: 25 }}
      >{`${taskName[0].toUpperCase()}${taskName.slice(1)}`}</Text>
      <Text style={{ ...styles.points, fontSize: 25 }}>
        {!showFinishMsg ? `${lap} of ${repeatFreq}` : 'Finished!'}
      </Text>
      {time > 0 ? (
        <Text style={styles.points}>{displayTime()}</Text>
      ) : (
        resetAndClearRunningTimer()
      )}
      <Text style={{ ...styles.points, fontSize: 25 }}>
        {taskRunning && !paused
          ? 'Running'
          : taskRunning && paused
          ? 'Paused'
          : null}
      </Text>
      <View style={styles.iconStyle}>
        <Button
          icon={
            <Icon
              name="md-play"
              size={30}
              color={disableRunning() ? '#C1C1C1' : '#3879D9'}
            />
          }
          disabled={disableRunning()}
          onPress={handleStart}
          // sets 14 initially without waiting for 1 sec
          // if (time === countdownTime) setTime(countdownTime - 1);
          raised={true}
          type="clear"
        />
        <Button
          icon={
            <Icon
              name="md-refresh"
              size={30}
              color={disableClear() ? '#C1C1C1' : '#3879D9'}
            />
          }
          onPress={handleClear}
          disabled={disableClear()}
          type="clear"
        />
        <Button
          icon={
            <Icon
              name="md-pause"
              size={30}
              color={disablePause() ? '#C1C1C1' : '#3879D9'}
            />
          }
          onPress={handlePause}
          disabled={disablePause()}
          type="clear"
        />
      </View>
      <Button
          icon={
            <Icon
              name="md-trash"
              size={30}
              color={'#EE1628'}
            />
          }
          onPress={handleDelete}
          type="clear"
        />
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
  }
})

const mapDispatchToProps = dispatch => {
  return {
    onToggleSwitch: listItem => dispatch(updateTaskStatus(listItem)),
    deleteTaskFromState: taskName => dispatch(deleteTask(taskName))
  }
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(timer)
