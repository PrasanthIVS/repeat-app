import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import startMainTabs from '../MainTabs/startMainTabs'

class Welcome extends Component {
  componentDidMount() {
    // TODO: uncomment to show splash screen
    // SplashScreen.show()
    // setTimeout(function() {
    //   SplashScreen.hide()
    // }, 2000)
  }

  onButtonPress = () => {
    // this.props.navigator.push({
    //   screen: "repeatApp.TaskGroupScreen",
    //   title: "Create Task Group"
    // })
    startMainTabs()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.hello}>Hello!</Text>
        <Text style={styles.welcome}>Let's start by creating a Task Group</Text>
        <Button
          icon={<Icon name="md-add-circle" size={50} color="#00802b" />}
          onPress={this.onButtonPress}
          type="clear"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  hello: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10
  }
})

export default Welcome
