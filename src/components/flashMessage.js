import { showMessage } from 'react-native-flash-message'

const flashMessage = (message, type, icon) => {
    console.log('called')
    showMessage({
        message,
        type,
        icon,
        floating: true
      })
}

export default flashMessage
