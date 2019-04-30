import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  Slider
} from "react-native";
import { TextField } from "react-native-material-textfield";
import { isEmpty, isNil } from "ramda";
import { connect } from "react-redux";
import { saveTaskGroup } from "../../store/actions/tasks";
import FlashMessage, { showMessage } from "react-native-flash-message";
import TimePicker from "./timePicker";

class TaskGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: "",
      repeatFrequency: 0,
      lagTime: null,
      taskStarted: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === "didDisappear") {
      this.setState({
        taskName: "",
        repeatFrequency: 0,
        lagTime: null,
        taskStarted: false
      });
    }
  }

  createTaskGroup = () => {
    const { taskName, repeatFrequency, lagTime } = this.state;
    var errorMessage;
    if (isEmpty(taskName)) {
      errorMessage = "Task name should not be empty"
    } else if (repeatFrequency === 0){
      errorMessage = "Task should set to repeat atleast once"
    } else {
      errorMessage = "Lag time should not be empty"
    }

    if (isEmpty(taskName) || repeatFrequency === 0 || isNil(lagTime)) {
      showMessage({
        message: errorMessage,
        type: "danger",
        icon: "auto"
      });
    } else {
      this.setState({
        taskName: "",
        repeatFrequency: 0,
        lagTime: null,
        taskStarted: false
      });
      showMessage({
        message: `Task Created for ${lagTime[0]} hr ${lagTime[1]} min!`,
        type: "success",
        icon: "auto"
      });
      this.props.onCreateTaskGroup(this.state);
      // this.props.navigator.push({
      //   screen: "repeatApp.TaskListScreen",
      //   title: "Task List"
      // });
    }
  };

  setLagTime = selectedTime => {
    this.setState({ lagTime: selectedTime.time.split(":") });
  };

  onTaskNameChange = value => {
    this.setState({ taskName: value });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Task name"
          onChangeText={this.onTaskNameChange}
          value={this.state.taskName}
          style={styles.textInput}
          // autoFocus
          maxLength={30}
        />
        <Text style={{ color: "black", marginTop: 25 }}>
          Task will repeat {this.state.repeatFrequency} {this.state.repeatFrequency === 1 ? 'time' : 'times'}
        </Text>
        <Slider
          maximumValue={100}
          minimumValue={0}
          step={1}
          value={this.state.repeatFrequency}
          onValueChange={repeatFrequency => this.setState({ repeatFrequency })}
          style={styles.slider}
        />
        <TouchableOpacity
          style={styles.textInput}
          onPress={() => TimePicker.timePicker(this.setLagTime)}
        >
          <Text style={styles.lagTimeText}>
            {this.state.lagTime ? this.state.lagTime : "Lag Time"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.createTaskGroup}
          activeOpacity={0.5}
          style={styles.startButtonStyle}
        >
          <Text style={styles.textStyle}>Save</Text>
        </TouchableOpacity>
        <FlashMessage position="top" />
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
  textInput: {
    alignItems: "center",
    marginBottom: 5
  },
  startButtonStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#00802b",
    borderRadius: 10,
    borderWidth: 1,
    width: "25%",
    borderColor: "#fff"
    // marginTop: 25
  },
  textStyle: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  lagTimeText: {
    color: "#989C9E",
    marginBottom: 25
  },
  slider: {
    width: "70%",
    marginBottom: 25
  }
});

const mapStateToProps = state => {
  return {
    taskName: state.tasks.taskName,
    repeatFrequency: state.tasks.repeatFrequency,
    lagTime: state.tasks.lagTime
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCreateTaskGroup: taskInfo => dispatch(saveTaskGroup(taskInfo))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskGroup);
