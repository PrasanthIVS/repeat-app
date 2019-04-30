import { TASK_ADDED, TASK_STATUS_UPDATE } from "../actions/actionTypes";

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
    default:
      return state;
  }
};

export default reducer;
