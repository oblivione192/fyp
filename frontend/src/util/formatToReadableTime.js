//convert 11:19:59 PM to just 11:19 PM 

export default function makeTimeReadable(timeString){ 
      const tokens =  timeString.split(':');  
      return [tokens[0],tokens[1]].join(':')
}
