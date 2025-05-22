'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { FaX } from 'react-icons/fa6';
import { Colors } from '@/utils/Colors';
import { broadcastMessageOrThrow } from '@/services/rest-api/notifications-repo';
import { useAdmin } from '@/providers/AdminProvider';

interface props{
    onCancel: ()=> void,
}


export default function BroadcaseMessage({onCancel}:props) {
    const {admin} = useAdmin();
    const adminId = admin!._id;
    const [messageContent, setMessageContent] = useState('');
    const [messageTitle, setMessageTitle] = useState('');

    const sendMessageMutation = useMutation({
          mutationFn: ()=> broadcastMessageOrThrow({adminId, messageContent, messageTitle}),
          onSuccess: () => {
            alert('Message sent successfully!');
            onCancel();
            setMessageContent('');
            setMessageTitle('');
          },
          onError: (error) => {
            console.error('Error sending message:', error);
            alert('An error occurred while sending the message.');
          },
        }
    );


    return (
        <div  onClick={onCancel} className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div onClick={(e)=>{
                e.stopPropagation()
              }} style={{animationDuration: '0.75s'}} className="relative bg-white modal-animate p-6 rounded-lg">
            <div onClick={onCancel} className='rounded-[50%] z-[51] absolute -right-3.5 -top-3.5 cursor-pointer text-[12px] p-3 flex items-center justify-center text-white' style={{backgroundColor:Colors.themeColor}}>
                <FaX />
            </div>
            <h2 className="text-xl font-semibold mb-4">Broadcast Message</h2>
            
            {/* Message Title Input */}
            <input
              type="text"
              value={messageTitle}
              
              onChange={(e) => {
                setMessageTitle(e.target.value)
              }}
              placeholder="Topic"
              className="w-full px-4 py-3 bg-tertiary border outline-none border-none rounded-[15px] mb-4"
            />

            {/* Message Content Textarea */}
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 border bg-tertiary outline-none border-none rounded-[15px] mb-4"
              rows={5}
            />

            <div className="flex justify-end">
              <button
                onClick={onCancel}
                className=" text-gray-700 py-2 px-4 rounded mr-2 bg-tertiary">
                Cancel
              </button>
              <button
                onClick={()=>sendMessageMutation.mutate()}
                className="text-white py-2 px-4 rounded bg-themeColor"
                disabled={sendMessageMutation.isPending}>
                {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
    )
}
