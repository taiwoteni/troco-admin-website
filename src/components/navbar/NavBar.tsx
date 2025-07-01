'use client'

import React, { useEffect, useMemo, useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { FaCalculator } from "react-icons/fa";
import { IoSearchCircleSharp } from "react-icons/io5";
import { PiPaperPlaneTiltFill} from "react-icons/pi";
import { toast} from "sonner";
import Image from "next/image";
import TrackTransaction from "@/components/transactions/TrackTransaction";
import Notification from "@/utils/interfaces/Notification";
import BroadcaseMessage from "./BroadcaseMessage";
import FeeCalculator from "./FeeCalculator";
import NotificationsLayout from "./NotificationsLayout";
import { useAdmin } from "@/providers/AdminProvider";
import SetAdminPin from "./SetAdminPin";
import { Lock } from "iconsax-react";
import { Colors } from "@/utils/Colors";



const Navbar = () => {
  const {admin, notifications} = useAdmin();
  const adminOnline = admin!;

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showTrackUI, setShowTrackUI] = useState(false);
  const [showChangeAuthPin, setShowChangeAuthPin] = useState(false);

  const [showFeeCalculator, setShowFeeCalculator] = useState(false);
  const [showBroadcastUI, setShowBroadcastUI] = useState(false);

  const unreadNotificationCount = useMemo(()=>notifications.filter(notification => !notification.read).length || 0, [notifications]);


  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const closeNotificationModal = () => {
    setSelectedNotification(null);
  };

  useEffect(() => {
    if (unreadNotificationCount > 0) {
      toast.info(`You have ${unreadNotificationCount} unread notifications`, {
        id:'notification-toast'
      });
    }
  }, [unreadNotificationCount]);

  return (
    <>
      <div className="w-full justify-between items-center flex py-5 pr-12 pl-3 bg-white h-[80px] shadow-sm mb-3">

        <div className="flex flex-1 justify-end items-center gap-x-10 justify-self-end">
          <div className="relative flex items-center justify-center rounded-[50%] w-[41px] h-[41px] bg-tertiary">
            <FaCalculator onClick={()=>setShowFeeCalculator(true)} title="Fee Calculator" className="cursor-pointer text-[19px] text-themeColor" />

            {showFeeCalculator && <FeeCalculator onCancel={()=> setShowFeeCalculator(false)} />}

          </div>
          <div className="flex items-center justify-center rounded-[50%] w-[41px] h-[41px] bg-tertiary">
            <PiPaperPlaneTiltFill onClick={()=>setShowBroadcastUI(true)} className="cursor-pointer text-[25px] text-themeColor" title="Broadcast Message"/>

             {showBroadcastUI && <BroadcaseMessage onCancel={()=> setShowBroadcastUI(false)} />} 
          </div>
          <div className="relative flex items-center justify-center rounded-[50%] w-[41px] h-[41px] bg-tertiary">
            <IoSearchCircleSharp onClick={()=>setShowTrackUI(!showTrackUI)} className="cursor-pointer text-[25px] text-themeColor" title="Track Transaction" />

            {showTrackUI && (
              <TrackTransaction onCancel={()=>setShowTrackUI(false)}/>
            )}
          </div>

          {adminOnline.role === 'Super Admin' && <div className="flex items-center justify-center rounded-[50%] w-[41px] h-[41px] bg-tertiary">
            <Lock onClick={()=>setShowChangeAuthPin(true)} className="cursor-pointer text-[25px] text-themeColor" size={25} variant="Bold" color={Colors.secondary}/>

             {showChangeAuthPin && <SetAdminPin onCancel={()=> setShowChangeAuthPin(false)} />} 
          </div>}

          <div className="relative rounded-[50%] p-2 bg-tertiary">
            <IoNotifications onClick={toggleNotifications} title="Notifications" className="cursor-pointer text-[25px] text-secondary" />
            {unreadNotificationCount > 0 && (
              <div className="absolute flex items-center justify-center top-0 -right-1 h-[22px] w-[22px] rounded-full border-[3px] border-white text-white text-sm font-semibold text-center bg-themeColor">
                <p>{unreadNotificationCount}</p>
              </div>
            )}
            {showNotifications && <NotificationsLayout notifications={notifications} />}
          </div>

          <div className="flex items-center gap-x-5">
            <div className="flex flex-col">
              <p className="font-bold text-[15px]">
                {adminOnline && adminOnline.username && adminOnline.username.charAt(0).toUpperCase() + adminOnline.username.slice(1)}
              </p>
              <p className="text-gray-500 font-medium text-[11px]">{adminOnline?.role}</p>
            </div>
            <Image src='/images/profile_img.png' width={70} height={70} objectFit='cover' alt="profile-icon" />
          </div>
        </div>

        {selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-md shadow-lg w-96 p-4 flex flex-col">
              <h2 className="text-lg font-bold">{selectedNotification.notificationTitle}</h2>
              <p className="mt-2">{selectedNotification.notificationContent}</p>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md" onClick={closeNotificationModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
