'use client';

import { Colors } from "@/utils/Colors";
import formatDate from "@/utils/DateFormat";
import { Session } from "@/utils/interfaces/session";
import { Messages1 } from "iconsax-react";
import React from "react";

interface props {
  session: Session;
}

export default function SessionItemLayout({ session: group }: props) {
  return (
    <div className="flex items-center mb-2 justify-between gap-5 py-2 px-4 cursor-pointer">
      <div className="flex flex-1 gap-3">
        <div
          className="w-[47px] h-[47px] rounded-[50%] mr-[20px] flex items-center justify-center bg-themeColor bg-opacity-20">
          <Messages1
            size={24}
            color={Colors.themeColor}
          />
        </div>
        <div className="flex flex-col justify-center gap-[2px]">
          <p className="font-semibold" style={{ fontSize: "14.25px" }}>
            {group.user.email}
          </p>
          <div className="font-quicksand" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            Last Messaged at {formatDate(group.lastActivity)}
          </div>
        </div>
    
      </div>
    </div>
  );
}
