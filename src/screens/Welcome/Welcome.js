import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import startMainTabs from "../MainTabs/startMainTabs";

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
    startMainTabs();
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.hello}>Hello!</Text>
        <Text style={styles.welcome}>Let's start by creating a Task Group</Text>
        <TouchableOpacity
          onPress={this.onButtonPress}
          activeOpacity={0.5}
          style={styles.startButtonStyle}
        >
          <Text style={styles.textStyle}>Create</Text>
        </TouchableOpacity>
        {/* <Button title="create" onPress={this.onButtonPress} color="#00802b" /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  hello: {
    fontSize: 30,
    textAlign: "center",
    margin: 10
  },
  startButtonStyle: {
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#00802b',
    borderRadius:10,
    borderWidth: 1,
    width: '25%',
    borderColor: '#fff',
  },
  textStyle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default Welcome;
