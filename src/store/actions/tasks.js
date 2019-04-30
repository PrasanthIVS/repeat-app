import {
  TASK_ADDED,
  TASK_STATUS_UPDATE
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
 