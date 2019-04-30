import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import Modal from 'react-native-modal'
import { connect } from "react-redux";
import { pathOr } from 'ramda'
import { updateTaskStatus } from "../../store/actions/tasks";
import EmptyBoxAnimation from './EmptyBoxAnimation'

class TaskList extends Component {
  state = {
    showTaskDetails: false,
  };

  toggleSwitch = (index) => {
    this.props.onToggleSwitch(index);
    this.startTimer(this.props.taskList[index])
  };

  convertToSeconds = (lagTime) => +lagTime[0]*60*60 + +lagTime[1]*60

  startTimer = (currentSelectedItem) => {
    console.log(!currentSelectedItem.taskStarted)
    console.log(this.convertToSeconds(currentSelectedItem.lagTime))
    // var myVar ;
    // if (taskStarted) {
    //   myVar = setInterval(() => console.log('repeat'), 1000))
    // } else {
    //   clearInterval(myVar)
    // }
  }

  showTaskDetails = (show, listItem = {}) => {
    const taskInfo = `Name:   ${listItem.taskName}
Frequency:   ${listItem.repeatFrequency}
Lag Time:   ${listItem.lagTime[0]} hr ${listItem.lagTime[1]} min
Running:   ${listItem.taskStarted ? 'Yes' : 'No'}`
    this.setState({ showTaskDetails: show });
    Alert.alert('Task Info', taskInfo)
  };

  showAnimation = () => <EmptyBoxAnimation />

  render() {
    return (
      this.props.taskList.length > 0 ? 
      (<View>
        {this.props.taskList.map((listItem, index) => (
          <TouchableNativeFeedback
            onPress={() => this.showTaskDetails(true, listItem)}
            key={index}
          >
            <View style={styles.container}>
              <Text style={styles.taskItem}>{listItem.taskName}</Text>
              <Switch
                style={styles.switch}
                value={listItem.taskStarted}
                onValueChange={() => this.toggleSwitch(index)}
              />
            </View>
          </TouchableNativeFeedback>
        ))}
      </View>) : <EmptyBoxAnimation />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  taskItem: {
    marginLeft: 10
  },
  switch: {
    marginRight: 10
  }
});

const mapStateToProps = state => {
  return {
    taskList: pathOr([], ['tasks', 'taskList'], state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleSwitch: index => dispatch(updateTaskStatus(index))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);
