'use client'

import LoadingLayout from '@/components/loading/LoadingLayout';
import { useMessages, useSession } from '@/providers/SessionsProvider';
import { Colors } from '@/utils/Colors';
import { Messages1, Send } from 'iconsax-react';
import { useParams } from 'next/navigation'
import errorAnim from '../../../../../public/lottie/error.json'
import React, { FormEvent, useRef, useState } from 'react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { FaSmile } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa6';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '@/services/rest-api/sessions-api';
import SessionChatItemLayout from '@/components/sessions/SessionChatItemLayout';

export default function SessionPage() {
  const {id:sessionId} = useParams();
  const session = useSession(sessionId?.toString() ?? "")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const messages = useMessages(sessionId?.toString() ?? "")

  const mutation = useMutation({
    mutationFn: async()=> await sendMessage({ content: newMessage, sessionId: session!._id, senderId: session!.customerCare._id }, true),
    onSuccess: () => {
      setNewMessage('');
    },
    onError: ()=>{
      toast.error("Error sending chat");
    }
  });

  if(!session) return (
    <div className='w-full h-full rounded-2xl shadow-md box-border overflow-hidden'>
      <LoadingLayout lottie={errorAnim} label={"This session doesn't exist or has expired"} className={`w-full h-full text-2xl`} />
    </div>
  )

  const handleSendMessage = async(e: FormEvent) => {
      e.preventDefault();
      if (newMessage.trim()) {
          mutation.mutate();
      }
  };
  
  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };


  return (
    <div className='bg-white w-full h-full flex flex-col rounded-2xl shadow-md box-border overflow-hidden'>
      <div className="flex gap-3 items-center bg-white border-b-[1.5px] rounded-t-2xl sticky top-0 z-10 py-3 mb-1 w-full">
        <div
          className="w-[42px] h-[42px] rounded-[50%] ml-3 flex items-center justify-center bg-themeColor bg-opacity-20">
          <Messages1
            size={22}
            color={Colors.themeColor}
          />
        </div>

        <h2 className="text-2xl font-semibold">{session?.user.email}</h2>
      </div>

       {messages.length !== 0 && <div className="flex flex-col flex-1 overflow-y-scroll px-4 custom-scrollbar" ref={chatContainerRef}>
          <div className='w-full h-fit flex flex-col mt-6'>
            {messages.map((msg, index) => {            
                const isFirstMessage = index === 0;
                const isLastMessage = index === messages.length-1;
                let sameSender = false;
                let firstTimeSender = false;
                let lastTimeSender = false;;


                if(!isFirstMessage && !isLastMessage){
                sameSender = msg.sender === messages[index-1].sender
                }

                if(!isFirstMessage){
                firstTimeSender = msg.sender !== messages[index-1].sender
                }

                if(!isLastMessage){
                lastTimeSender = msg.sender !== messages[index+1].sender
                }
                else if(!isFirstMessage){
                lastTimeSender = msg.sender !== messages[index-1].sender
                }

                

                return (
                <div key={index} className='flex flex-col'>
                    <SessionChatItemLayout
                    message={msg}
                    clientId={session?.user._id} 
                    firstSender={firstTimeSender}
                    lastSender={lastTimeSender}
                    lastMessageSent={isLastMessage}
                    sameSender={sameSender}
                    />
                </div>
                );
            })}
          </div>
        </div>
       }
      
       {messages.length == 0 && <div className='w-full flex-1 flex flex-center text-center font-quicksand text-secondary'>No Discussions Yet.</div>}
      
      

      <div className="w-full px-3 mt-1 py-4 border-t-[1.5px]">
        <form className="flex relative" onSubmit={handleSendMessage}>
          <button
              type="button"
              onClick={() => setShowEmojiPicker((val) => !val)}
              className="mr-2 p-3 bg-gray-300 text-gray-700 rounded-full"
          >
              <FaSmile className="text-gray-700 text-[25px]" />
          </button>
          {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
          )}
          <input
              type="text"
              className="flex-1 p-2 border rounded-full outline-none"
              placeholder="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" disabled={mutation.isPending} className="ml-2 w-[40px] h-[40px] flex flex-center bg-themeColor text-white rounded-full">
              {!mutation.isPending && <Send variant='Bold' color='#fff' size={'25px'} className="text-white translate-x-[1.5px] text-[25px]" />}
              {mutation.isPending && <FaSpinner className='text-[25px] text-white animate-spin' />}
  
          </button>
        </form>
      </div>
    </div>
  )
}
