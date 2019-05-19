import {
  TASK_ADDED,
  TASK_STATUS_UPDATE,
  TASK_COUNT_UPDATE,
  UPDATE_TASK_COMPLETE_STATUS
} from "../actions/actionTypes";

const initialState = {
  taskList: {}
};

  const updateTaskCompletionStatus = (taskList) =>
  taskList.map((listItem) => {
      return {
        ...listItem,
        taskCompleted: true
      }
  });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TASK_ADDED: {
      const { taskInfo } = action
      const { taskName } = taskInfo
      return {
        ...state,
        taskList: {
          ...state.taskList,
          [taskName]: taskInfo
        }
      };
    }

    case TASK_STATUS_UPDATE: {
      const { listItem } = action
      const { taskName } = listItem
      return {
        ...state,
        taskList: {
          ...state.taskList,
          [taskName]: {
            ...state.taskList[taskName],
            taskStarted: !state.taskList[taskName].taskStarted
          }
        }
      };
    }

    case TASK_COUNT_UPDATE: {
      const { taskName} = action
      return {
        ...state,
        taskList: {
          ...state.taskList,
          [taskName]: {
            ...state.taskList[taskName],
            taskCompletedCount: state.taskList[taskName].taskCompletedCount + 1
          }
        }
      }
    }

    case UPDATE_TASK_COMPLETE_STATUS: {
      const { taskName } = action
      return {
        ...state,
        taskList: {
          ...state.taskList,
          [taskName]: {
            ...state.taskList[taskName],
            taskCompleted: true
          }
        }
      }
    }

    default:
      return state;
  }
};

export default reducer;
