import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import renderIf from 'render-if'
import { isEmpty, pathOr, isNil } from 'ramda'
import {
  updateCompletedCount,
  updateTaskCompletedStatus
} from '../../store/actions/tasks'
import Timer from './timer'
import FlashMessage from 'react-native-flash-message'

// TODO: setup webpack

const dashboard = props => {
  const [borderColor, updateBorderColor] = useState('#3879D9')

  const changeBorderColor = (color) => updateBorderColor(color)

  const { taskList } = props
  return (
    <View style={styles.container}>
      <View style={{ ...styles.innerView, borderColor }}>
        {isEmpty(taskList) ? null : (
          <Timer taskList={taskList} changeBorderColor={changeBorderColor} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: '#3C3C3C',
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
  innerView: {
    // backgroundColor: '#00802b',
    borderRadius: 100,
    borderWidth: 10,
    width: 350,
    height: 350,
    borderColor: '#3879D9',
    display: 'flex',
    justifyContent: 'space-around'
  }
})

const mapStateToProps = state => {
  const taskList = pathOr({}, ['tasks', 'taskList'], state)
  return {
    taskList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateTaskCompletedCount: taskName =>
      dispatch(updateCompletedCount(taskName)),
    taskCompleted: taskName => dispatch(updateTaskCompletedStatus(taskName))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(dashboard)
