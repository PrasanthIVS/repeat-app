import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableNativeFeedback,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import { pathOr, isEmpty } from 'ramda'
import { updateTaskStatus } from 'src/store/actions/tasks'
import { EmptyBoxAnimation } from './EmptyBoxAnimation'

// TODO: remove commented code and console logs

class TaskList extends Component {
  state = {
    showTaskDetails: false
  }

  toggleSwitch = taskName => {
    const { taskList, onToggleSwitch } = this.props
    onToggleSwitch(taskList[taskName])
    this.startTimer(this.props.taskList[taskName])
  }

  // should be milliseconds
  convertToSeconds = lagTime => +lagTime[0] * 60 * 60 + +lagTime[1] * 60

  startTimer = currentSelectedItem => {
    // console.log(!currentSelectedItem.taskRunning)
    // console.log(this.convertToSeconds(currentSelectedItem.lagTime))
    // var myVar ;
    // if (taskRunning) {
    //   myVar = setInterval(() => console.log('repeat'), 1000))
    // } else {
    //   clearInterval(myVar)
    // }
  }

  showTaskDetails = (show, listItem = {}) => {
    const { lagTime, taskName, repeatFrequency, taskRunning } = listItem
    const { hours, minutes, seconds } = lagTime
    const taskInfo = `Name:   ${taskName}
Frequency:   ${repeatFrequency}
Lag Time:   ${hours} hr ${minutes} min ${seconds} sec
Running:   ${taskRunning ? 'Yes' : 'No'}`
    this.setState({ showTaskDetails: show })
    Alert.alert('Task Info', taskInfo)
  }

  showAnimation = () => <EmptyBoxAnimation />

  render() {
    const { taskList } = this.props
    const taskListArray = Object.keys(taskList)
    return !isEmpty(taskList) ? (
      <View>
        {taskListArray.map((taskName, index) => (
          <TouchableNativeFeedback
            onPress={() => this.showTaskDetails(true, taskList[taskName])}
            key={index}
          >
            <View style={styles.container}>
              <Text style={styles.taskItem}>{taskList[taskName].taskName}</Text>
              <Switch
                style={styles.switch}
                value={taskList[taskName].taskRunning}
                onValueChange={() => this.toggleSwitch(taskName)}
              />
            </View>
          </TouchableNativeFeedback>
        ))}
      </View>
    ) : (
        <EmptyBoxAnimation />
      )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  taskItem: {
    marginLeft: 10
  },
  switch: {
    marginRight: 10
  }
})

const mapStateToProps = state => {
  return {
    taskList: pathOr({}, ['tasks', 'taskList'], state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onToggleSwitch: listItem => dispatch(updateTaskStatus(listItem))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
