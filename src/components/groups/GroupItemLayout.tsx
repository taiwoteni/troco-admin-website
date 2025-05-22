'use client';

import Image from "next/image";
import React from "react";

export interface Message {
  content?: string;
  thumbnail?: string;
  attachment?: string;
  _id: string;
  profile?:string;
  sender?: string;
  readBy: string[];
  timestamp:string;
}

export interface Group {
  name: string;
  deadlineTime: string;
  creationTime: string;
  useDelivery: boolean;
  adminId: string;
  _id: string;
  members:string[];
  messages: Message[];
  creator: string;
}

function senderText(group: Group): string {
  const messages = group.messages;
  if (messages.length == 0) {
    return "";
  }

  if (messages[messages.length - 1].sender === group.adminId) {
    return "Admin: ";
  }

  if (messages[messages.length - 1].sender === group.members[0]) {
    return "Seller: ";
  }

  /// If a group has a buyer, The buyer is usually the last person on the least
  /// In the case of super admins sending messages, their ids don't match with adminId
  /// or any id in the list, so it's safe to assume that if the previous conditions were not true
  /// (i.e if the sender id dosn't match the admin id and the seller id)
  /// doesn't match the buyer id and the members are complete
  /// (i.e up to 3), then it's a super admin

  if(group.members.length >= 3){
    if (messages[messages.length - 1].sender !== group.members[group.members.length-1]) {
      return "Admin: ";
    }
  }
  


  return "Buyer: ";
}

function messageText(group: Group): string {
  const messages = group.messages;
  if (messages.length == 0) {
    return "This Group was created";
  }

  const lastMessage = messages[messages.length - 1];

  if (lastMessage.attachment == null) {
    return messages[messages.length - 1].content ?? "Group was ...";
  }

  /// If an image was sent
  if (
    ["jpeg", "jpg", "img", "bmp", "png"].includes(
      lastMessage.attachment
        .substring(lastMessage.attachment.lastIndexOf(".") + 1)
        .toLowerCase()
    )
  ) {
    return "Image was sent";
  }

  return "Video was sent";
}

interface props {
  group: Group;
  unreadMessages?: number;
}

export default function GroupItemLayout({ group, unreadMessages = 0 }: props) {
  return (
    <div className="flex items-center mb-2 justify-between gap-5 py-2 px-4 cursor-pointer">
      <div className="flex flex-1 gap-3">
        <div
          className="w-[47px] h-[47px] rounded-[50%] mr-[20px] flex items-center justify-center"
          style={{ backgroundColor: "#e8fce8" }}>
          <Image
            src="/icons/dashboard/group.svg"
            alt="Icon"
            width={24}
            height={24}
          />
        </div>
        <div className="flex flex-col justify-center gap-[2px]">
          <p className="font-semibold" style={{ fontSize: "14.25px" }}>
            {group.name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {senderText(group).trim().length !== 0 && (
              <p
                className="text-gray-500"
                style={{ fontSize: "12px", fontWeight: "bold" }}
              >
                {senderText(group).trim()}
              </p>
            )}
            <p className="text-gray-500 flex flex-1 truncate w-[250px] " style={{ fontSize: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {messageText(group)}
            </p>
          </div>
        </div>
    
      </div>
      { unreadMessages > 0 &&
              <div className=" text-center font-bold text-[11px] w-[24px] h-[24px] text-white rounded-[50%] inline-flex items-center justify-center bg-themeColor">
                {unreadMessages>99? "99+":unreadMessages}
              </div>}
    </div>
  );
}
