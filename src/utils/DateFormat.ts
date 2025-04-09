'use client';
const formatDate = (dateString: string | Date, showTime=true) => {
    const date = typeof dateString !== "string"? (dateString as Date): new Date(dateString);
  
    const options = { day: '2-digit', month: 'short', year: 'numeric' } as Intl.DateTimeFormatOptions;
    let formattedDate = date.toLocaleDateString('en-GB', options);

  
  
    if (typeof dateString === "string" && dateString.includes('T') && showTime) { // Check if time component exists
      // Extract the time and format it
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedTime = `at ${hours}:${minutes.toString().padStart(2, '0')} ${ampm.toUpperCase()}`;
  
      formattedDate += ` ${formattedTime}`; // Append time to the date
    }
  
    return formattedDate;
  };



  export default formatDate;