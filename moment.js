const  moment = require('moment');



console.log ("前月同日:",moment('2021-11-15').subtract(1,'month').format('YYYY-MM-DD'))

console.log("前月初日:",moment('2021-11-15').add(-1,'month').startOf('month').format("YYYY-MM-DD"))
console.log("前月末日:",moment('2021-11-15').add(-1,'month').endOf('month').format("YYYY-MM-DD"))

console.log("前々月初日:",moment('2021-11-15').add(-2,'month').startOf('month').format("YYYY-MM-DD"))
console.log("前々月末日:",moment('2021-11-15').add(-2,'month').endOf('month').format("YYYY-MM-DD"))
