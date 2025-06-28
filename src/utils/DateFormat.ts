import { format } from 'date-fns';

const formatDate = (dateString: string | Date, showTime=true) => {
    const date = typeof dateString !== "string"? (dateString as Date): new Date(dateString);
  
    const formattedDate = format(date, `dd MMM yyyy${showTime? " 'at' hh:mm a": ''}`, )
  
    return formattedDate;
};



  export default formatDate;