import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native'
import renderIf from 'render-if'
import startMainTabs from '../MainTabs/startMainTabs'
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from 'mongodb-stitch-react-native-sdk'
import { SimpleSpinner } from '../TaskList/EmptyBoxAnimation'

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUserId: undefined,
      client: undefined,
      showSpinner: false
    }
    this._loadClient = this._loadClient.bind(this)
    this._onPressLogin = this._onPressLogin.bind(this)
    this._onPressLogout = this._onPressLogout.bind(this)
  }

  componentDidMount() {
    // TODO: uncomment to show splash screen
    // SplashScreen.show()
    // setTimeout(function() {
    //   SplashScreen.hide()
    // }, 2000)
    this._loadClient()
  }

  onButtonPress = () => {
    // this.props.navigator.push({
    //   screen: "repeatApp.TaskGroupScreen",
    //   title: "Create Task Group"
    // })
    // TODO: initialize the db connection here and use contecxt api to share between files
    // startMainTabs()
    setTimeout(() => startMainTabs('lfufjfufjjjjjj'), 3000)
    this.setState({ showSpinner: true })
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient('repeatapprn-dhnsc').then(client => {
      // console.log(client)
      this.setState({ client })

      if (client.auth.isLoggedIn) {
        this.setState({ currentUserId: client.auth.user.id })
      }
    })
  }

  _onPressLogin() {
    this.state.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(user => {
        console.log(`Successfully logged in as user ${user.id}`)
        this.setState({ currentUserId: user.id })
      })
      .catch(err => {
        console.log(`Failed to log in anonymously: ${err}`)
        this.setState({ currentUserId: undefined })
      })
  }

  _onPressLogout() {
    this.state.client.auth
      .logout()
      .then(user => {
        console.log(`Successfully logged out`)
        this.setState({ currentUserId: undefined })
      })
      .catch(err => {
        console.log(`Failed to log out: ${err}`)
        this.setState({ currentUserId: undefined })
      })
  }

  render() {
    let loginStatus = 'Currently logged out.'

    if (this.state.currentUserId) {
      loginStatus = `Currently logged in as ${this.state.currentUserId}!`
    }

    loginButton = <Button onPress={this._onPressLogin} title="Login" />

    logoutButton = <Button onPress={this._onPressLogout} title="Logout" />
    return (
      <View style={styles.container}>
        <Text> {loginStatus} </Text>
        {this.state.currentUserId !== undefined ? logoutButton : loginButton}
        <Text style={styles.hello}>Hello!</Text>
        <Text style={styles.welcome}>Let's start by creating a Task Group</Text>
        <TouchableOpacity
          onPress={this.onButtonPress}
          activeOpacity={0.5}
          style={styles.startButtonStyle}
        >
          <Text style={styles.textStyle}>Create</Text>
        </TouchableOpacity>
        <View style={{ height: '70%', width: '70%' }}>
          {renderIf(this.state.showSpinner)(<SimpleSpinner />)}
        </View>

        {/* <Button title="create" onPress={this.onButtonPress} color="#00802b" /> */}
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
  },
  startButtonStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#00802b',
    borderRadius: 10,
    borderWidth: 1,
    width: '25%',
    borderColor: '#fff'
  },
  textStyle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
})

export default Welcome
