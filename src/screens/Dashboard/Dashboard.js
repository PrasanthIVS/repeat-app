import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { isEmpty, pathOr, isNil } from 'ramda'
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-react-native-sdk'
import {
  updateCompletedCount,
  updateTaskCompletedStatus
} from '../../store/actions/tasks'
import Timer from './timer'
import { EmptyBoxAnimation, SimpleSpinner } from '../TaskList/EmptyBoxAnimation'

// TODO: setup webpack, remove react-native-circular-progress package

const dashboard = props => {
  const [borderColor, updateBorderColor] = useState('#3879D9')
  const [showSpinner, toggleSpinner] = useState(true)
  const [taskList, addSavedTasks] = useState({})

  useEffect(() => {
    const stitchAppClient = Stitch.defaultAppClient
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      'mongodb-atlas-repeatAppRN'
    )
    const db = mongoClient.db('repeatApp')
    const tasks = db.collection('tasks')
    tasks
      .find({
        email: 'prashanth.sai529@gmail.com'
      })
      .toArray()
      .then(res => {
        console.log('response', res)
        const taskObjects = {
          ...res.map(taskObj => ({
            [taskObj.taskName]: {
              ...taskObj,
              id: taskObj._id.toString()
            }
          }))
        }

        props.saveTaskObjectsInRedux(taskObjects)
        const { taskName } = res
        // addSavedTasks({
        //   [taskName]: {
        //     ...res
        //   }
        // })
        toggleSpinner(false)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const changeBorderColor = color => updateBorderColor(color)

  // const { taskList } = props

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
            : { ...styles.innerView, borderColor }
        }
      >
        {showSpinner ? (
          <SimpleSpinner />
        ) : isEmpty(taskList) ? (
          <EmptyBoxAnimation />
        ) : (
          <Timer
            taskList={taskList}
            changeBorderColor={changeBorderColor}
            navProps={props.navigator}
          />
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
    taskCompleted: taskName => dispatch(updateTaskCompletedStatus(taskName)),
    saveTaskObjectsInRedux: taskObjs => dispatch()
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(dashboard)
