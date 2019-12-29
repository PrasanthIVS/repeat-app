export const getCountdownTimeInMs = lagTime => {
  const { hours, minutes, seconds } = lagTime
  return +hours * 3600000 + +minutes * 60000 + +seconds * 1000
}

export const displayTime = time => {
  const roundedHrs = Math.floor(time / 3600000)
  const hours = `${roundedHrs}`.length === 1 ? `0${roundedHrs}` : roundedHrs
  const roundedMins = Math.floor(time / 60000) - roundedHrs * 60
  const minutes =
    `${roundedMins}`.length === 1 ? `0${roundedMins}` : roundedMins
  const roundedSecs =
    Math.floor(time / 1000) - roundedHrs * 3600 - roundedMins * 60
  const seconds =
    `${roundedSecs}`.length === 1 ? `0${roundedSecs}` : roundedSecs
  return `${hours} : ${minutes} : ${seconds}`
}
