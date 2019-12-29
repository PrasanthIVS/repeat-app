export const formatLagTime = taskInfo =>
  ['hours', 'minutes', 'seconds'].reduce((obj, key) => {
    const formattedValue =
      `${taskInfo.lagTime[key]}`.length === 2
        ? `${taskInfo.lagTime[key]}`
        : `0${taskInfo.lagTime[key]}`
    obj[key] = formattedValue
    return obj
  }, {})
