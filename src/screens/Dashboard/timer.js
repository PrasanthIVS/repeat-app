import React, { useState } from 'react'
import { Text, View, StyleSheet, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import {
  updateTaskStatus,
  deleteTask,
  updateEditStatus
} from 'src/store/actions/tasks'
import timerStyles from './timer.style'
import { getCountdownTimeInMs, displayTime } from 'src/utils/timerUtils'

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
  const {
    taskList,
    onToggleSwitch,
    changeBorderColor,
    navProps,
    deleteTaskFromState,
    toggleEditStatus
  } = props
  const taskName = Object.keys(taskList)[0]
  const lagTime = taskList[taskName].lagTime
  const countdownTime = getCountdownTimeInMs(lagTime)
  const repeatFreq = taskList[taskName].repeatFrequency
  const taskRunning = taskList[taskName].taskRunning

  let [time, setTime] = useState(countdownTime)
  let [paused, pauseTimer] = useState(false)
  let [lap, setLap] = useState(1)
  let [showFinishMsg, updateFinishMsgStatus] = useState(false)
  let [fill, setFill] = useState(0)

  const handleStart = () => {
    setFill(100)
    updateFinishMsgStatus(false)
    // changeBorderColor('#3879D9')
    pauseTimer(false)
    !taskRunning && onToggleSwitch(taskList[taskName])
    if (time === countdownTime && !paused) return startTime(time, setTime) // (time - 2) sets 13 on function call
    if (time < countdownTime && paused) return startTime(time, setTime)
  }

  const handleClear = () => {
    pauseTimer(false)
    setLap(1)
    setFill(0)
    setTime(500)
    setTimeout(() => setTime(countdownTime), 500)
    clearInterval(myFunc)
    taskRunning && onToggleSwitch(taskList[taskName])
  }

  const handlePause = fill => {
    setFill(fill)
    pauseTimer(true)
    clearInterval(myFunc)
  }

  // TODO: task delete variable names

  const handleDelete = fill => {
    // TODO: locale
    taskRunning && handlePause(fill)
    Alert.alert('Confirm delete?', 'Your progress will be lost', [
      {
        text: 'No',
        style: 'cancel',
        onPress: () => {
          // taskRunning && pauseTimer(false)
          // taskRunning && startTime(time, setTime)
          // TODO: bug here
        }
      },
      {
        text: 'Yes',
        onPress: () => {
          clearInterval(myFunc)
          deleteTaskFromState(taskName)
          navProps.setTabBadge({
            tabIndex: 1,
            badge: Object.keys(taskList).length - 1
          })
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
          navProps.push({
            screen: 'repeatApp.TaskGroupScreen',
            title: 'Edit task',
            passProps: {
              taskNameToBeEdited: taskName
            }
          })
          toggleEditStatus(taskName, true)
        }
      }
    ])
  }

  const disableRunning = () => taskRunning && !paused

  const disableClear = () => !taskRunning

  const disablePause = () => paused || !taskRunning

  const resetAndClearRunningTimer = () => {
    if (lap === repeatFreq) {
      setTime(countdownTime)
      setLap(1)
      clearInterval(myFunc)
      // changeBorderColor('#6A9955')
      setTimeout(() => {
        onToggleSwitch(taskList[taskName])
        updateFinishMsgStatus(true)
      }, 500)
    } else if (lap <= repeatFreq) {
      setTime(countdownTime)
      repeatFreq !== lap && setLap(lap + 1)
      // repeatFreq - lap === 1 && changeBorderColor('#EE1628')
      clearInterval(myFunc)
      startTime(countdownTime, setTime)
    } else {
      setFill(100)
      // showFinishMsg = true
      setTime(countdownTime)
      clearInterval(myFunc)
    }
  }

  const customButton = ({
    iconName,
    disable = false,
    onPressHandler,
    raised = false,
    color = '#3879D9'
  }) => (
    <Button
      icon={
        <Icon name={iconName} size={30} color={disable ? '#C1C1C1' : color} />
      }
      disabled={disable}
      onPress={onPressHandler}
      // sets 14 initially without waiting for 1 sec
      // if (time === countdownTime) setTime(countdownTime - 1);
      raised={raised}
      type="clear"
    />
  )

  const formattedTaskName = () =>
    `${taskName[0].toUpperCase()}${taskName.slice(1)}`
  const finishMsg = () =>
    !showFinishMsg ? `${lap} of ${repeatFreq}` : 'Finished!'

  return (
    <View>
      {/* TODO: errors out at the end of last iteration */}
      <AnimatedCircularProgress
        size={350}
        width={30}
        backgroundWidth={30}
        fill={fill}
        tintColor="#3879D9"
        duration={time * repeatFreq}
        backgroundColor="#383838"
      >
        {fill => (
          <>
            <Text style={{ ...styles.points, fontSize: 25 }}>
              {formattedTaskName()}
            </Text>
            <Text style={{ ...styles.points, fontSize: 25 }}>
              {finishMsg()}
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
              {customButton({
                iconName: 'md-play',
                disable: disableRunning(),
                onPressHandler: () => handleStart(fill),
                raised: true
              })}
              {customButton({
                iconName: 'md-refresh',
                disable: disableClear(),
                onPressHandler: () => handleClear(fill)
              })}
              {customButton({
                iconName: 'md-pause',
                disable: disablePause(),
                onPressHandler: () => handlePause(fill)
              })}
            </View>
            <View style={styles.editDeleteButtonsView}>
              {customButton({
                iconName: 'md-trash',
                onPressHandler: () => handleDelete(fill),
                color: '#EE1628'
              })}
              {/* <Button
                icon={<Icon name="md-create" size={30} color={'#3879D9'} />}
                onPress={handleEdit}
                type="clear"
              /> */}
            </View>
          </>
        )}
      </AnimatedCircularProgress>
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

export default connect(null, mapDispatchToProps)(Timer)
