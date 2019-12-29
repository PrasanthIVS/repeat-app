export const formatLagTime = taskInfo => ({
  ...taskInfo.lagTime,
  ...['hours', 'minutes', 'seconds'].reduce((key, obj) => {
    const formattedValue =
      `${taskInfo.lagTime[key]}`.length === 2
        ? `${taskInfo.lagTime[key]}`
        : `0${taskInfo.lagTime[key]}`
    obj[key] = formattedValue
    return obj
  }, {})
})
