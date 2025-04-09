import routes from '@/app/routes';
import { JSX } from 'react';
import { FaUsers } from 'react-icons/fa'
import { FaRepeat } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export type SideBarData = {
    icon: JSX.Element,
    path: string,
    title: string,
}

export const SideBarArray : SideBarData[] = [
  {
    icon: <MdSpaceDashboard className=" w-[25px] h-[25px]"/> ,
    path: routes.dashboard.path,
    title: "Dashboard",
  },
  {
    icon: <FaUsers className="w-[25px] h-[25px]"/>,
    path: routes.dashboard.users.path,
    title: "Users",
  },
  {
    icon: <RiVerifiedBadgeFill className="w-[25px] h-[25px]"/>,
    path: routes.dashboard.kyc.path,
    title: "Kyc",
  },
  {
    icon: <PiWarningCircleFill className="w-[25px] h-[25px]"/>,
    path: routes.dashboard.reports.path,
    title: "Reports",
  },
  {
    icon: <FaRepeat className=" w-[25px] h-[25px]"/>,
    path: routes.dashboard.transactions.path,
    title: "Transactions",
  },
  
]; 


