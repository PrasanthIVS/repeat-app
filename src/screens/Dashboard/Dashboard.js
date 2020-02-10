import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { isEmpty, pathOr, isNil } from 'ramda'
import {
  updateCompletedCount,
  updateTaskCompletedStatus
} from 'src/store/actions/tasks'
import Timer from './Timer'
import { EmptyBoxAnimation } from 'src/screens/TaskList/EmptyBoxAnimation'

// TODO: setup webpack

const dashboard = props => {
  const { taskList, navigator } = props
  // console.log(props)
  return (
    <View style={styles.container}>
      <View
        style={
          isEmpty(taskList)
            ? {
                ...styles.innerView,
                borderWidth: 0,
                height: '100%',
                width: '100%'
              }
            : { ...styles.innerView }
        }
      >
        {isEmpty(taskList) ? (
          <EmptyBoxAnimation />
        ) : (
          <Timer taskList={taskList} navProps={navigator} />
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
    // // backgroundColor: '#00802b',
    // borderRadius: 100,
    // borderWidth: 10,
    // width: 350,
    // height: 350,
    // borderColor: '#3879D9',
    // display: 'flex',
    // justifyContent: 'space-around'
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

export default connect(mapStateToProps, mapDispatchToProps)(dashboard)
