import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  Slider,
  Picker
} from "react-native";
import { TextField } from "react-native-material-textfield";
import { isEmpty, isNil } from "ramda";
import { connect } from "react-redux";
import { saveTaskGroup } from "../../store/actions/tasks";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { range } from "ramda";

class TaskGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: "",
      repeatFrequency: 0,
      lagTime: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      taskStarted: false,
      taskCompletedCount: 0,
      taskCompleted: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === "didDisappear") {
      this.setState({
        taskName: "",
        repeatFrequency: 0,
        lagTime: {
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        taskStarted: false
      });
    }
  }

  isLagTimeEmpty = () => {
    const { lagTime: { hours, minutes, seconds } } = this.state
    return hours === 0 && minutes === 0 && seconds === 0
  }

  createTaskGroup = () => {
    const { taskName, repeatFrequency, lagTime } = this.state;
    var errorMessage;
    if (isEmpty(taskName)) {
      errorMessage = "Task name should not be empty";
    } else if (repeatFrequency === 0) {
      errorMessage = "Task should set to repeat atleast once";
    } else {
      errorMessage = "Lag time should not be empty";
    }

    if (isEmpty(taskName) || repeatFrequency === 0 || this.isLagTimeEmpty()) {
      showMessage({
        message: errorMessage,
        type: "danger",
        icon: "auto"
      });
    } else {
      const { hours, minutes, seconds } = lagTime
      this.setState({
        taskName: "",
        repeatFrequency: 0,
        lagTime: {
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        taskStarted: false
      });
      showMessage({
        message: `Task Created for ${hours} hr ${minutes} min ${seconds} sec!`,
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

  onTaskNameChange = value => {
    this.setState({ taskName: value });
  };

  render() {
    const { repeatFrequency, lagTime, taskName } = this.state
    const { hours, minutes, seconds } = lagTime
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Task name"
          onChangeText={this.onTaskNameChange}
          value={taskName}
          style={styles.textInput}
          // autoFocus
          maxLength={30}
        />
        <Text style={{ color: "black", marginTop: 25 }}>
          Task will repeat {repeatFrequency}{" "}
          {repeatFrequency === 1 ? "time" : "times"}
        </Text>
        <Slider
          maximumValue={100}
          minimumValue={0}
          step={1}
          value={repeatFrequency}
          onValueChange={repeatFrequency => this.setState({ repeatFrequency })}
          style={styles.slider}
        />
        {/* selected value, picker options should be strings */}
        <View style={styles.picker}>
          <Picker
            selectedValue={`${hours}`}
            style={{ height: 50, width: 100 }}
            onValueChange={itemValue =>
              this.setState({
                lagTime: {
                  ...lagTime,
                  hours: +itemValue
                }
              })
            }
            prompt="Select Hours"
          >
            {range(0, 24).map(hrValue => (
              <Picker.Item
                label={`${hrValue}`}
                value={`${hrValue}`}
                key={hrValue}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={`${minutes}`}
            style={{ height: 50, width: 100 }}
            onValueChange={itemValue =>
              this.setState({
                lagTime: {
                  ...lagTime,
                  minutes: +itemValue
                }
              })
            }
            prompt="Select Minutes"
          >
            {range(0, 60).map(minValue => (
              <Picker.Item
                label={`${minValue}`}
                value={`${minValue}`}
                key={minValue}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={`${seconds}`}
            style={{ height: 50, width: 100 }}
            onValueChange={itemValue =>
              this.setState({
                lagTime: {
                  ...lagTime,
                  seconds: +itemValue
                }
              })
            }
            prompt="Select Seconds"
          >
            {range(0, 60).map(secValue => (
              <Picker.Item
                label={`${secValue}`}
                value={`${secValue}`}
                key={secValue}
              />
            ))}
          </Picker>
        </View>
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
  },
  picker: {
    display: "flex",
    flexDirection: "row"
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
