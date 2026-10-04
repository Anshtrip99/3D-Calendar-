export const months = [
  { name:'January', color:'#e55b52', scene:'A New Year, a quiet toast', holidays:{1:'New Year’s Day',14:'Makar Sankranti',26:'Republic Day'} },
  { name:'February', color:'#dc7990', scene:'A little note for someone', holidays:{14:'Valentine’s Day'} },
  { name:'March', color:'#f0bf25', scene:'A weekend among the peaks', holidays:{6:'Maha Shivaratri',10:'Eid al-Fitr',22:'Holi',26:'Good Friday'} },
  { name:'April', color:'#f1d57d', scene:'Room for a slower morning', holidays:{8:'Ugadi',15:'Ram Navami'} },
  { name:'May', color:'#85c8dc', scene:'Summer tastes like watermelon', holidays:{1:'Labour Day',17:'Bakri Id',20:'Buddha Purnima'} },
  { name:'June', color:'#347b9c', scene:'A desk, in its own little world', holidays:{15:'Muharram'} },
  { name:'July', color:'#d997a7', scene:'The soft light of a Sunday', holidays:{5:'Rath Yatra'} },
  { name:'August', color:'#cbaa53', scene:'A small celebration of home', holidays:{15:'Independence Day',17:'Raksha Bandhan',25:'Janmashtami'} },
  { name:'September', color:'#bc5c32', scene:'A fresh corner, new beginnings', holidays:{4:'Ganesh Chaturthi',11:'Onam'} },
  { name:'October', color:'#64733c', scene:'Candlelight, and a little colour', holidays:{2:'Gandhi Jayanti',10:'Dussehra',29:'Diwali'} },
  { name:'November', color:'#287781', scene:'A warm drink for a cold day', holidays:{14:'Guru Nanak Jayanti'} },
  { name:'December', color:'#433773', scene:'One last evening together', holidays:{25:'Christmas'} },
]

export function monthMatrix(monthIndex) {
  const firstDay = new Date(2027, monthIndex, 1).getDay()
  const days = new Date(2027, monthIndex + 1, 0).getDate()
  const cells = Array(firstDay).fill(null)
  for (let day = 1; day <= days; day++) cells.push(day)
  while (cells.length % 7) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7))
}
