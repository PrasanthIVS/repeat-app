import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import WelcomeScreen from "./src/screens/Welcome/Welcome";
import TaskGroupScreen from "./src/screens/TaskGroup/TaskGroup";
import TaskListScreen from "./src/screens/TaskList/TaskList";
import DashboardScreen from "./src/screens/Dashboard/Dashboard";
import configureStore from "./src/store/configureStore";

const store = configureStore();

Navigation.registerComponent("repeatApp.WelcomeScreen", () => WelcomeScreen);
Navigation.registerComponent(
  "repeatApp.TaskGroupScreen",
  () => TaskGroupScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "repeatApp.TaskListScreen",
  () => TaskListScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "repeatApp.DashboardScreen",
  () => DashboardScreen,
  store,
  Provider
);

Navigation.startSingleScreenApp({
  screen: {
    screen: "repeatApp.WelcomeScreen",
    title: "Welcome"
  }
});
