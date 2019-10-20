import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  Picker
} from 'react-native'
import Slider from '@react-native-community/slider'
import { isEmpty, pathOr, dissoc } from 'ramda'
import { connect } from 'react-redux'
import { saveTaskGroup } from '../../store/actions/tasks'
import { range } from 'ramda'
import displayMessage from '../../components/flashMessage'
import FlashMessage from 'react-native-flash-message'
import {
  NotePadAnimation,
  CheckMarkAnimation
} from '../TaskList/EmptyBoxAnimation'
import { Input } from 'react-native-elements'

class TaskGroup extends Component {
  constructor(props) {
    super(props)
    const { taskList, taskNameToBeEdited } = this.props
    this.state = {
      taskName: taskNameToBeEdited ? taskNameToBeEdited : '',
      repeatFrequency: taskNameToBeEdited
        ? taskList[taskNameToBeEdited].repeatFrequency
        : 0,
      lagTime: {
        hours: taskNameToBeEdited
          ? +taskList[taskNameToBeEdited].lagTime.hours
          : 0,
        minutes: taskNameToBeEdited
          ? +taskList[taskNameToBeEdited].lagTime.minutes
          : 0,
        seconds: taskNameToBeEdited
          ? +taskList[taskNameToBeEdited].lagTime.seconds
          : 0
      },
      taskRunning: false,
      taskCompletedCount: 0,
      taskCompleted: false,
      editMode: false
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  onNavigatorEvent(event) {
    console.log(event)
    if (event.id === 'didDisappear') {
      this.setState({
        taskName: '',
        repeatFrequency: 0,
        lagTime: {
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        taskRunning: false
      })
    }
  }

  isLagTimeEmpty = () => {
    const {
      lagTime: { hours, minutes, seconds }
    } = this.state
    return hours === 0 && minutes === 0 && seconds === 0
  }

  createTaskGroup = () => {
    const { taskName, repeatFrequency, lagTime } = this.state
    var errorMessage
    if (isEmpty(taskName)) {
      errorMessage = 'Task name should not be empty'
    } else if (repeatFrequency === 0) {
      errorMessage = 'Task should set to repeat atleast once'
    } else {
      errorMessage = 'Lag time should not be empty'
    }

    // TODO: can delete this as I'm disabling save button & showing error messages
    if (isEmpty(taskName) || repeatFrequency === 0 || this.isLagTimeEmpty()) {
      return displayMessage(errorMessage, 'danger', 'auto')
    } else {
      const { hours, minutes, seconds } = lagTime
      this.setState({
        taskName: '',
        repeatFrequency: 0,
        lagTime: {
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        taskRunning: false
      })
      const message = `Task Created for ${hours} hr ${minutes} min ${seconds} sec!`
      // TODO: remove the message as I'm showing check mark animation
      // displayMessage(message, 'success', 'auto')
      this.props.onCreateTaskGroup(this.state)
      // this.props.navigator.push({
      //   screen: "repeatApp.DashboardScreen",
      //   title: "Dashboard",
      //   backButtonHidden: true,
      // });
    }
  }

  // TODO: allow only alphabets
  onTaskNameChange = value => {
    this.setState({ taskName: value })
  }

  disableSaveButton = () => {
    const { taskName, repeatFrequency, lagTime } = this.state
    // check whether something has changed
    if (this.props.taskNameToBeEdited) {
      return (
        this.props.taskList[this.props.taskNameToBeEdited].taskName === taskName
      )
    }
    if (isEmpty(taskName) || repeatFrequency === 0 || this.isLagTimeEmpty())
      return true
    if (!isEmpty(this.props.taskList)) return true
    return false
  }

  renderEveryThing = () => <View></View>
  render() {
    // console.log(this.props)
    const { repeatFrequency, lagTime, taskName } = this.state
    const { hours, minutes, seconds } = lagTime
    return (
      <View style={styles.container}>
        {!isEmpty(this.props.taskList) ? (
          <View style={{ height: '50%', width: '70%' }}>
            <CheckMarkAnimation />
          </View>
        ) : (
          <View style={{ height: '50%', width: '70%' }}>
            <NotePadAnimation />
          </View>
        )}
        <TextInput
          placeholder="Task name"
          onChangeText={this.onTaskNameChange}
          value={taskName}
          style={styles.textInput}
          // autoFocus
          maxLength={30}
        />
        <Text style={{ color: 'black', marginTop: 25 }}>
          Task will repeat {repeatFrequency}{' '}
          {repeatFrequency === 1 ? 'time' : 'times'}
        </Text>
        <Slider
          maximumValue={100}
          minimumValue={0}
          step={1}
          value={repeatFrequency}
          onValueChange={repeatFrequency => this.setState({ repeatFrequency })}
          style={styles.slider}
        />
        {/* selected value, picker options should be strings */}
        <View style={styles.picker}>
          <Picker
            selectedValue={`${hours}`}
            style={{ height: 50, width: 100 }}
            onValueChange={itemValue =>
              this.setState({
                lagTime: {
                  ...lagTime,
                  hours: +itemValue
                }
              })
            }
            prompt="Select Hours"
          >
            {range(0, 24).map(hrValue => (
              <Picker.Item
                label={`${hrValue}`}
                value={`${hrValue}`}
                key={hrValue}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={`${minutes}`}
            style={{ height: 50, width: 100 }}
            onValueChange={itemValue =>
              this.setState({
                lagTime: {
                  ...lagTime,
                  minutes: +itemValue
                }
              })
            }
            prompt="Select Minutes"
          >
            {range(0, 60).map(minValue => (
              <Picker.Item
                label={`${minValue}`}
                value={`${minValue}`}
                key={minValue}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={`${seconds}`}
            style={{ height: 50, width: 100 }}
            onValueChange={itemValue =>
              this.setState({
                lagTime: {
                  ...lagTime,
                  seconds: +itemValue
                }
              })
            }
            prompt="Select Seconds"
          >
            {range(0, 60).map(secValue => (
              <Picker.Item
                label={`${secValue}`}
                value={`${secValue}`}
                key={secValue}
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          onPress={this.createTaskGroup}
          activeOpacity={0.5}
          // TODO: cleanup
          style={{
            ...styles.startButtonStyle,
            backgroundColor: this.disableSaveButton()
              ? '#C1C1C1'
              : styles.startButtonStyle.backgroundColor
          }}
          disabled={this.disableSaveButton()}
        >
          <Text style={styles.textStyle}>Save</Text>
        </TouchableOpacity>
        <FlashMessage position="top" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  textInput: {
    alignItems: 'center',
    marginBottom: 5
  },
  startButtonStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#00802b',
    borderRadius: 10,
    borderWidth: 1,
    width: '25%',
    borderColor: '#fff'
    // marginTop: 25
  },
  textStyle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  lagTimeText: {
    color: '#989C9E',
    marginBottom: 25
  },
  slider: {
    width: '70%',
    marginBottom: 25
  },
  picker: {
    display: 'flex',
    flexDirection: 'row'
  }
})

const mapStateToProps = state => {
  return {
    // taskName: state.tasks.taskName, // useless
    // repeatFrequency: state.tasks.repeatFrequency,
    // lagTime: state.tasks.lagTime,
    taskList: pathOr({}, ['tasks', 'taskList'], state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCreateTaskGroup: taskInfo =>
      dispatch(
        saveTaskGroup({
          ...taskInfo,
          taskName: taskInfo.taskName.toLowerCase(),
          lagTime: {
            ...taskInfo.lagTime,
            hours:
              `${taskInfo.lagTime.hours}`.length === 2
                ? `${taskInfo.lagTime.hours}`
                : `0${taskInfo.lagTime.hours}`,
            minutes:
              `${taskInfo.lagTime.minutes}`.length === 2
                ? `${taskInfo.lagTime.minutes}`
                : `0${taskInfo.lagTime.minutes}`,
            seconds:
              `${taskInfo.lagTime.seconds}`.length === 2
                ? `${taskInfo.lagTime.seconds}`
                : `0${taskInfo.lagTime.seconds}`
          }
        })
      )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskGroup)
