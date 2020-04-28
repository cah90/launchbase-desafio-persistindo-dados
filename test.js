function date(timestamp) {
  const date = new Date(timestamp)

  const year = date.getUTCFullYear()
  const month = `0${date.getUTCMonth() + 1}`.slice(-2)
  const day = `0${date.getUTCDate()}`.slice(-2)

  return {
    iso: `${year}-${month}-${day}`,
    birthDay: `${day}/${month}`
  }
}

const a = date(02/02/2002).iso
console.log(a)

// console.log('Date.now()')
// console.log(Date.now())
// console.log('date(Date.now())')
// console.log(date(Date.now()))
// console.log('date(Date.now()).iso')
// console.log(date(Date.now()).iso)