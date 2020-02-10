import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Slider from '@react-native-community/slider'
import { isEmpty, pathOr, omit } from 'ramda'
import { connect } from 'react-redux'
import { saveTaskGroup } from 'src/store/actions/tasks'
import {
  NotePadAnimation,
  CheckMarkAnimation
} from 'src/screens/TaskList/EmptyBoxAnimation'
import TimePicker from './TimePicker'
import { formatLagTime } from 'src/utils/taskGroupUtils'
import taskGroupStyles from './taskGroup.style'

// TODO: change the component to functional

const initialState = {
  taskName: '',
  repeatFrequency: 0,
  lagTime: {
    hours: 0,
    minutes: 0,
    seconds: 0
  },
  taskRunning: false,
  taskCompletedCount: 0,
  taskCompleted: false,
  editMode: false,
  showNotePadAnimation: true
}
class TaskGroup extends Component {
  constructor(props) {
    super(props)
    const { navigator } = this.props
    this.state = initialState
    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  onNavigatorEvent(event) {
    if (event.id === 'didDisappear') {
      this.setState(
        omit(
          [
            'taskCompletedCount',
            'taskCompleted',
            'editMode',
            'showNotePadAnimation'
          ],
          initialState
        )
      )
    }
  }

  isLagTimeEmpty = () => {
    const {
      lagTime: { hours, minutes, seconds }
    } = this.state
    return [hours, minutes, seconds].every(key => key === 0)
  }

  createTaskGroup = () => {
    const { onCreateTaskGroup, navigator, taskList } = this.props
    onCreateTaskGroup(this.state)
    this.setState({
      ...initialState,
      showNotePadAnimation: false
    })
    setTimeout(() => {
      this.setState({ showNotePadAnimation: true })
      navigator.switchToTab({
        tabIndex: 1 // (optional) if missing, this screen's tab will become selected
      })
    }, 3000)
    navigator.setTabBadge({
      tabIndex: 1,
      badge: Object.keys(taskList).length + 1
    })
  }

  // TODO: allow only alphabets
  onTaskNameChange = value => {
    this.setState({ taskName: value })
  }

  disableSaveButton = () => {
    const { taskName, repeatFrequency } = this.state
    const { taskNameToBeEdited, taskList } = this.props
    // check whether something has changed
    if (taskNameToBeEdited) {
      return taskList[taskNameToBeEdited].taskName === taskName
    }
    if (!isEmpty(taskList)) return true
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
    const {
      repeatFrequency,
      taskName,
      lagTime,
      showNotePadAnimation
    } = this.state
    return (
      <View style={styles.container}>
        {showNotePadAnimation ? (
          <View style={{ height: '40%', width: '70%' }}>
            <NotePadAnimation />
          </View>
        ) : (
          <View style={{ height: '40%', width: '70%' }}>
            <CheckMarkAnimation />
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

const mapStateToProps = state => ({
  taskList: pathOr({}, ['tasks', 'taskList'], state)
})

const mapDispatchToProps = dispatch => ({
  onCreateTaskGroup: taskInfo =>
    dispatch(
      saveTaskGroup({
        ...taskInfo,
        taskName: taskInfo.taskName.toLowerCase(),
        lagTime: formatLagTime(taskInfo)
      })
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskGroup)
