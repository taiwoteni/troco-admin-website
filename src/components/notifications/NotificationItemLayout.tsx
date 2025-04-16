import Image from "next/image";
import { Colors } from "../../utils/Colors";
import Notification from "../../utils/interfaces/Notification";
import React from 'react'
import { PiWechatLogoFill } from "react-icons/pi";
import formatDate from "../../utils/DateFormat";

interface props{
    notification:Notification
}

function NotificationIcon({notification}:props):React.JSX.Element{
    return (
        <div className="w-[40px] h-[40px] text-[23px] rounded-[50%] mr-[20px] flex items-center justify-center" style={{backgroundColor:Colors.themeTranspaentColor, color:Colors.themeColor}}>
            {notification.notificationTitle.toLowerCase().includes("driver") && <Image width={23} height={23} src={"/icons/dashboard/driver.svg"} alt=""/>}
            {notification.notificationTitle.toLowerCase().includes("transaction") && !notification.notificationTitle.toLowerCase().includes("driver") && <Image width={23} height={23} src={"/icons/transaction/transaction.svg"} alt=""/>}
            {!notification.notificationTitle.toLowerCase().includes("driver") && !notification.notificationTitle.toLowerCase().includes("transaction") && <PiWechatLogoFill />}
        </div>
    )
}


export default function NotificationItemLayout({notification}:props) {
      
  return (
    <div className="p-2 border-b flex last:border-b-0 border-[#F9F8F6] cursor-pointer hover:bg-[#F9F8F6] transition-colors duration-1000 ease-in">
        <NotificationIcon notification={notification} />
        <div className="flex flex-1 flex-col mr-6 overflow-hidden box-border">
            <p className="text-sm font-semibold overflow-hidden box-border text-ellipsis whitespace-nowrap">{notification.notificationTitle}</p>
            <p className="text-xs text-gray-500">
            {isNaN(Date.parse(notification.notificationTime))
                ? 'Invalid date'
                : formatDate(notification.notificationTime, true)}
            </p>
        </div>
        {!notification.read && <div className="rounded-[50%] w-1.5 h-1.5 self-center bg-themeColor"></div> }
    </div>
  )
}
