import { TimePickerAndroid } from 'react-native'

const random = {
    async timePicker(setLagTime){
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: true, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
                //Applying extra 0 before the hour/minute for better visibility
                // 9 minutes => 09 minutes
                var m=(minute<10)?"0"+minute:minute;
                var h=(hour<10)?"0"+hour:hour;
                setLagTime({ time:h+":"+m})
            }
        } catch ({code, message}) {
            alert('Cannot open time picker'+message);
        }
    }
  }

  export default random