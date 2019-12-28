export const formatTaskDetails = taskInfo => ({
  ...taskInfo,
  taskName: taskInfo.taskName.toLowerCase(),
  lagTime: {
    ...taskInfo.lagTime,
    hours:
      `${taskInfo.lagTime.hours}`.length === 2
        ? `${taskInfo.lagTime.hours}`
        : `0${taskInfo.lagTime.hours}`,
    minutes:
      `${taskInfo.lagTime.minutes}`.length === 2
        ? `${taskInfo.lagTime.minutes}`
        : `0${taskInfo.lagTime.minutes}`,
    seconds:
      `${taskInfo.lagTime.seconds}`.length === 2
        ? `${taskInfo.lagTime.seconds}`
        : `0${taskInfo.lagTime.seconds}`
  }
})
