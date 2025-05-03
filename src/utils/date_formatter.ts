export const isoHumanDate = (isoDateStr) => {
  return new Date(isoDateStr).toLocaleString("en-US",{
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  )
}
