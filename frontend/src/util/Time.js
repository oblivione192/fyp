const showFormattedDate = function(time){ 
      const now = new Date(time);
      const formattedDate = now.toLocaleDateString(undefined, {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric'
      }); 

      return formattedDate;
     } 
const showFormattedTimeNow = function(){  
      const now = new Date();
      const formattedTime = now.toLocaleTimeString(undefined, {
         hour: '2-digit',
         minute: '2-digit',
         hour12: true // Set to false for 24-hour format
      });
      return formattedTime; 
} 

const showFormattedTime  =  function(time){ 
   const now = new Date(time);
      const formattedTime = now.toLocaleTimeString(undefined, {
         hour: '2-digit',
         minute: '2-digit',
         hour12: true // Set to false for 24-hour format
      });
      return formattedTime; 
}

function formatDate(dateString) {
  const date = new Date(dateString);

  // Get day name (Saturday)
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);

  // Get month name (July)
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  // Get day of the month with ordinal suffix (12th)
  const day = date.getDate();
  const dayWithSuffix = day + getOrdinalSuffix(day);

  // Get year
  const year = date.getFullYear();

  return `${monthName} ${dayWithSuffix} ${year} ${dayName}`;
}

// Helper function to add ordinal suffix
function getOrdinalSuffix(n) {
  if (n >= 11 && n <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export {formatDate,showFormattedDate,showFormattedTimeNow, showFormattedTime} 