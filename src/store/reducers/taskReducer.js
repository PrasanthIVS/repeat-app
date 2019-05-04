import {
  TASK_ADDED,
  TASK_STATUS_UPDATE,
  TASK_COUNT_UPDATE,
  UPDATE_TASK_COMPLETE_STATUS
} from "../actions/actionTypes";

const initialState = {
  taskList: []
};

const updateTaskStatus = (taskList, toggleItemIndex) =>
  taskList.map((listItem, index) => {
    if (index === toggleItemIndex) {
      return {
        ...listItem,
        taskStarted: !listItem.taskStarted
      };
    }
    return listItem;
  });

const updateTaskCounter = (taskList) =>
  taskList.map((listItem) => {
    return {
      ...listItem,
      taskCompletedCount: listItem.taskCompletedCount+1
    }
  })

  const updateTaskCompletionStatus = (taskList) =>
  taskList.map((listItem) => {
      return {
        ...listItem,
        taskCompleted: true
      }
  });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TASK_ADDED:
      return {
        ...state,
        taskList: [...state.taskList, action.taskInfo]
      };
    case TASK_STATUS_UPDATE:
      return {
        ...state,
        taskList: updateTaskStatus(state.taskList, action.index)
      };
    case TASK_COUNT_UPDATE:
      return {
        ...state,
        taskList: updateTaskCounter(state.taskList)
      }
    case UPDATE_TASK_COMPLETE_STATUS: {
      return {
        ...state,
        taskList: updateTaskCompletionStatus(state.taskList)
      }
    }
    default:
      return state;
  }
};

export default reducer;
