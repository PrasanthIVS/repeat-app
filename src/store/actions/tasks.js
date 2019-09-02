import {
  TASK_ADDED,
  TASK_STATUS_UPDATE,
  TASK_COUNT_UPDATE,
  UPDATE_TASK_COMPLETE_STATUS,
  DELETE_TASK,
  UPDATE_EDIT_STATUS,
} from "./actionTypes";

export const saveTaskGroup = taskInfo => ({
    type: TASK_ADDED,
    taskInfo: taskInfo
  })

export const updateTaskStatus = listItem => ({
    type: TASK_STATUS_UPDATE,
    listItem: listItem
  })

export const updateCompletedCount = (taskName) => ({
    type: TASK_COUNT_UPDATE,
    taskName
  })

export const updateTaskCompletedStatus = (taskName) => ({
  type: UPDATE_TASK_COMPLETE_STATUS,
  taskName
})
 
export const deleteTask = taskName => ({
  type: DELETE_TASK,
  taskName
})

export const updateEditStatus = (taskName, isEditMode) => ({
  type: UPDATE_EDIT_STATUS,
  taskName,
  isEditMode
})