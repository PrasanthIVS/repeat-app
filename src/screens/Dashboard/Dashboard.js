import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { connect } from "react-redux";
import renderIf from "render-if";
import { isEmpty, pathOr, isNil } from "ramda";
import {
  updateCompletedCount,
  updateTaskCompletedStatus
} from "../../store/actions/tasks";

class Dashboard extends Component {

  convertToMilliSeconds = lagTime =>
    +lagTime[0] * 3600000 + +lagTime[1] * 60000;

  componentWillReceiveProps(nextProps) {
    if (
      this.props.length === nextProps.length &&
      nextProps.taskList['Sleep'].taskStarted
    ) {
      const timeInMilliSeconds = this.convertToMilliSeconds(
        nextProps.taskList['Sleep'].lagTime
      );
      // this.circularProgress.animate(100, timeInMilliSeconds);
      this.circularProgress.animate(100, 30000);
    } else {
      this.circularProgress.animate(0, 1000);
    }
  }

  showNameAndPercentage = (taskList, fill) => {
    const { repeatFrequency, taskCompletedCount, taskCompleted } = taskList['Sleep'];

    if (fill === 100 && taskCompletedCount < repeatFrequency - 1) {
      this.circularProgress.reAnimate(0, 100, 30000);
      this.props.updateTaskCompletedCount('Sleep');
    }

    if (taskCompletedCount === repeatFrequency - 2 && fill === 100) {
      this.props.taskCompleted('Sleep');
    }

    return taskCompletedCount < repeatFrequency &&
      !(taskCompleted && fill > 99.95) ? (
      <View>
        <Text style={styles.points}>{taskList['Sleep'].taskName}</Text>
        <Text style={styles.points}>{Math.round(fill)}%</Text>
        <Text style={styles.taskCount}>
          Task ran {taskCompletedCount}{" "}
          {taskCompletedCount === 1 ? "time" : "times"}
        </Text>
      </View>
    ) : (
      <View>
        <Text style={styles.points}>Task Finished!</Text>
        <Text style={styles.taskCount}>
          Task ran {taskCompletedCount + 1}{" "}
          {taskCompletedCount + 1 === 1 ? "time" : "times"}
        </Text>
      </View>
    );
  };

  render() {
    const { taskList } = this.props;
    return (
      // <ScrollView>
      <View style={styles.container}>
        <AnimatedCircularProgress
          size={300}
          width={10}
          fill={0}
          tintColor="#1ED760"
          // onAnimationComplete={() => consol}
          ref={ref => (this.circularProgress = ref)}
        >
          {fill =>
            !isEmpty(taskList) && taskList['Sleep'].taskStarted
              ? this.showNameAndPercentage(taskList, fill)
              : null
          }
        </AnimatedCircularProgress>
        {/* <AnimatedCircularProgress
          size={300}
          width={10}
          fill={100}
          tintColor="#1ED760"
          onAnimationComplete={() => console.log("onAnimationComplete")}
          ref={ref => (this.circularProgress = ref)}
        >
          {fill => <Text style={styles.points}>{Math.round(fill)}</Text>}
        </AnimatedCircularProgress>
        <AnimatedCircularProgress
          size={300}
          width={10}
          fill={100}
          tintColor="#1ED760"
          onAnimationComplete={() => console.log("onAnimationComplete")}
          ref={ref => (this.circularProgress = ref)}
        >
          {fill => <Text style={styles.points}>{Math.round(fill)}</Text>}
        </AnimatedCircularProgress> */}
      </View>
      // </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#3C3C3C",
    flexDirection: "column",
    justifyContent: "center"
  },
  points: {
    textAlign: "center",
    color: "#7591af",
    fontSize: 50,
    fontWeight: "100"
  },
  taskCount: {
    textAlign: "center",
    color: "#7591af",
    fontSize: 20,
    fontWeight: "100"
  }
});

const mapStateToProps = state => {
  const taskList = pathOr({}, ["tasks", "taskList"], state);
  return {
    taskList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateTaskCompletedCount: (taskName) => dispatch(updateCompletedCount(taskName)),
    taskCompleted: (taskName) => dispatch(updateTaskCompletedStatus(taskName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
