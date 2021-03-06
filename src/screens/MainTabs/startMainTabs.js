import { Navigation } from 'react-native-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

const startTabs = () => {
  Promise.all([
    Icon.getImageSource('md-home', 30),
    Icon.getImageSource('md-add-circle', 30),
    Icon.getImageSource('md-list', 30),
    Icon.getImageSource('md-settings', 30)
  ]).then(sources => {
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: 'repeatApp.TaskGroupScreen',
          label: 'Create Task',
          title: 'Create Task',
          icon: sources[1]
        },
        {
          screen: 'repeatApp.DashboardScreen',
          label: 'Dashboard',
          title: 'Dashboard',
          icon: sources[0]
        },
        // {
        //   screen: 'repeatApp.TaskListScreen',
        //   label: "Task List",
        //   title: "Task List",
        //   icon: sources[2]
        // },
        {
          screen: 'repeatApp.TaskListScreen',
          label: 'Settings',
          title: 'Task List',
          icon: sources[3]
        }
      ],
      appStyle: {
        tabBarSelectedButtonColor: '#3879D9',
        tabBarBackgroundColor: '#eee'
      }
    })
  })
}

export default startTabs
