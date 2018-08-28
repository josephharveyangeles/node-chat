const moment = require('moment');
let date = moment();

console.log(date.format('h:mm a'))
// date.add(1, 'year').subtract(9, 'months');
// console.log(date.format('MMM DD YYYY')

let timestamp = new Date().getTime();

date = moment(timestamp);
console.log(date.format('MMM DD YYYY h:mm a'));