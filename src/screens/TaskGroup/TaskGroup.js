import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Slider from '@react-native-community/slider'
import { isEmpty, pathOr } from 'ramda'
import { connect } from 'react-redux'
import { saveTaskGroup } from '../../store/actions/tasks'
import {
  NotePadAnimation,
  CheckMarkAnimation
} from '../TaskList/EmptyBoxAnimation'
import TimePicker from './TimePicker'
import { formatLagTime } from '../../utils/taskGroupUtils'
import taskGroupStyles from './taskGroup.style'

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
    return [hours, minutes, seconds].some(key => key === 0)
  }

  createTaskGroup = () => {
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
    this.props.onCreateTaskGroup(this.state)
    // this.props.navigator.push({
    //   screen: "repeatApp.DashboardScreen",
    //   title: "Dashboard",
    //   backButtonHidden: true,
    // });
  }

  // TODO: allow only alphabets
  onTaskNameChange = value => {
    this.setState({ taskName: value })
  }

  disableSaveButton = () => {
    const { taskName, repeatFrequency } = this.state
    // check whether something has changed
    if (this.props.taskNameToBeEdited) {
      return (
        this.props.taskList[this.props.taskNameToBeEdited].taskName === taskName
      )
    }
    if (!isEmpty(this.props.taskList)) return true
    return isEmpty(taskName) || repeatFrequency === 0 || this.isLagTimeEmpty()
  }

  handleTimeChange = (time, timerKey) =>
    this.setState({
      lagTime: {
        ...this.state.lagTime,
        [timerKey]: time
      }
    })

  render() {
    const { repeatFrequency, taskName } = this.state
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
          {repeatFrequency === 1 ? 'time' : 'time(s)'}
        </Text>
        <Slider
          maximumValue={100}
          minimumValue={0}
          step={1}
          value={repeatFrequency}
          onValueChange={repeatFrequency => this.setState({ repeatFrequency })}
          style={styles.slider}
        />
        <View style={styles.picker}>
          <TimePicker handleTimeChange={this.handleTimeChange} />
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
      </View>
    )
  }
}

const styles = StyleSheet.create(taskGroupStyles)

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
          lagTime: formatLagTime(taskInfo)
        })
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskGroup)
