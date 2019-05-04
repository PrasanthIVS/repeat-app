import {
  TASK_ADDED,
  TASK_STATUS_UPDATE,
  TASK_COUNT_UPDATE,
  UPDATE_TASK_COMPLETE_STATUS
} from "./actionTypes";

export const saveTaskGroup = taskInfo => {
  return {
    type: TASK_ADDED,
    taskInfo: taskInfo
  }
}

export const updateTaskStatus = index => {
  return {
    type: TASK_STATUS_UPDATE,
    index: index
  }
}

export const updateCompletedCount = () => {
  // console.log('hello')
  return ({
    type: TASK_COUNT_UPDATE
  })
}

export const updateTaskCompletedStatus = () => ({
  type: UPDATE_TASK_COMPLETE_STATUS
})
 