import React, { useState } from 'react'
import { Text, View, StyleSheet, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import {
  updateTaskStatus,
  deleteTask,
  updateEditStatus
} from '../../store/actions/tasks'
import timerStyles from './timer.style'
import { getCountdownTimeInMs, displayTime } from '../../utils/timerUtils'

// TODO remove console logs

let myFunc
const showFinishMsg = false
function startTime(time, setTime) {
  myFunc = setInterval(() => {
    setTime((time = time - 1000))
  }, 1000)
}

// TODO: disable buttons conditionally based on pause/running
// TODO: clear styles
// TODO: default values

function Timer(props) {
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
    // TODO: locale
    handlePause()
    Alert.alert('Confirm delete?', 'Your progress will be lost', [
      {
        text: 'No',
        style: 'cancel',
        onPress: () => {
          pauseTimer(false)
          startTime(time, setTime)
        }
      },
      {
        text: 'Yes',
        onPress: () => {
          clearInterval(myFunc)
          props.deleteTaskFromState(taskName)
        }
      }
    ])
  }

  // TODO: edit functionality, pausing and resuming timer similar to handle delete
  handleEdit = () => {
    Alert.alert('Confirm edit?', 'Your progress will be lost', [
      {
        text: 'No',
        style: 'cancel'
      },
      {
        text: 'Yes',
        onPress: () => {
          props.navProps.push({
            screen: 'repeatApp.TaskGroupScreen',
            title: 'Edit task',
            passProps: {
              taskNameToBeEdited: taskName
            }
          })
          props.toggleEditStatus(taskName, true)
        }
      }
    ])
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

  const customButton = (iconName, disable, onPressHandler, raised = false) => (
    <Button
      icon={
        <Icon
          name={iconName}
          size={30}
          color={disable ? '#C1C1C1' : '#3879D9'}
        />
      }
      disabled={disable}
      onPress={onPressHandler}
      // sets 14 initially without waiting for 1 sec
      // if (time === countdownTime) setTime(countdownTime - 1);
      raised={raised}
      type="clear"
    />
  )

  return (
    <View>
      <Text
        style={{ ...styles.points, fontSize: 25 }}
      >{`${taskName[0].toUpperCase()}${taskName.slice(1)}`}</Text>
      <Text style={{ ...styles.points, fontSize: 25 }}>
        {!showFinishMsg ? `${lap} of ${repeatFreq}` : 'Finished!'}
      </Text>
      {time > 0 ? (
        <Text style={styles.points}>{displayTime(time)}</Text>
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
        {customButton('md-play', disableRunning(), handleStart, true)}
        {customButton('md-refresh', disableClear(), handleClear)}
        {customButton('md-pause', disablePause(), handlePause)}
      </View>
      <View style={styles.editDeleteButtonsView}>
        <Button
          icon={<Icon name="md-trash" size={30} color={'#EE1628'} />}
          onPress={handleDelete}
          type="clear"
        />
        <Button
          icon={<Icon name="md-create" size={30} color={'#3879D9'} />}
          onPress={handleEdit}
          type="clear"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create(timerStyles)

const mapDispatchToProps = dispatch => {
  return {
    onToggleSwitch: listItem => dispatch(updateTaskStatus(listItem)),
    deleteTaskFromState: taskName => dispatch(deleteTask(taskName)),
    toggleEditStatus: (taskName, isEditMode) =>
      dispatch(updateEditStatus(taskName, isEditMode))
  }
}

export default connect(() => ({}), mapDispatchToProps)(Timer)
