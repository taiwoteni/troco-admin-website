'use client'
import React, { useMemo, useState } from 'react'
import { Colors } from '@/utils/Colors'
import Notification from '@/utils/interfaces/Notification'
import NotificationItemLayout from '@/components/notifications/NotificationItemLayout'
import { toast } from 'sonner'
import { FaSpinner } from 'react-icons/fa'
import { useAdmin } from '@/providers/AdminProvider'
import { markNotificationOrThrow } from '@/services/rest-api/notifications-repo'

interface props{
    notifications:Notification[],
}

enum NotificationFilter{All='all', Read='read', Unread='unread'}

export default function NotificationsLayout({notifications}:props) {
    const {admin} = useAdmin();
    const adminId = admin!._id;

    const [filter, setFilter] = useState(NotificationFilter.All)
    const [loading, setLoading] = useState(false)

    const notifs = useMemo(()=>[...notifications].sort(()=>-1), [notifications])


    function Filter ({filterType}:{filterType:NotificationFilter}):React.JSX.Element{
        return <div onClick={()=>{
            setFilter(filterType)
        }} style={{backgroundColor:filterType === filter? Colors.themeColor:Colors.themeTranspaentColor,color:filterType === filter? "white":Colors.themeColor}} className='flex rounded-[25px] cursor-pointer items-center px-4 py-2 justify-center font-semibold text-[10px] transition-colors duration-[2s] ease-in'>
            <p>{filterType.charAt(0).toUpperCase() + filterType.substring(1).toLowerCase()}</p>
        </div>
    }

    const updateNotificationReadStatus = (notificationId:string) => {
        return markNotificationOrThrow(notificationId, adminId);
    };


    async function markAllAsRead(){
        const promises = notifs.filter(notif => !notif.read).map(notif => updateNotificationReadStatus(notif._id));
        
        let length = promises.length;
        const initialLength = Promise.length;
        let errors = 0;
        setLoading(true);
        promises.forEach(async(promise)=>{
            toast.loading('Marking Notifications As Read', {
                id:'mark-toast',
                description: `${length} notifications left`,
                dismissible: length<=1,
            });
            await promise.then(()=>{
                if(length==1){
                    setLoading(false);
                    toast.dismiss('mark-toast');
                    const successes = initialLength-errors;
                    if(successes >0){
                        toast.success(`Marked ${errors===0? 'all': successes} notifications as read.`)
                    }
                    if(errors > 0){
                        toast.error(`Failed to mark ${errors} notifications as read`)
                    }
                    return;
                }
                length-=1;
            }).catch(()=>{
                errors+=1;
                length-=1
            });
        })
        
    }

    const filteredNotification = useMemo(()=>notifs.filter((notif)=>{
        if(filter === 'all'){
            return true;
        }
        if(filter === 'read'){
            return notif.read;
        }

        return !notif.read
    }), [notifs, filter])

    return (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-fit h-fit">
            <div className='py-2 px-5 max-h-[400px] h-fit w-[400px] overflow-y-auto custom-scrollbar flex flex-col gap-3'>
                <p className="font-bold text-[20px] mb-2">Notifications</p>
                <div className='flex justify-between'>
                    <div className='flex w-fit justify-start items-center gap-3 mb-6'>
                        <Filter filterType={NotificationFilter.All} />
                        <Filter filterType={NotificationFilter.Read} />
                        <Filter filterType={NotificationFilter.Unread} />

                    </div>
                    {notifs.filter(notif => !notif.read).length >0 && <div className='flex justify-self-end text-[10px] cursor-pointer text-themeColor font-extrabold' onClick={()=>loading? {}: markAllAsRead()}>{loading? <FaSpinner className='animate-spin' />: "Mark all as read" }</div>}

                </div>
                {filteredNotification.map((notification, index)=>{
                    return <NotificationItemLayout key={index} notification={notification} />
                })}
                {filteredNotification.length ===0 && <p className='text-center text-[12px] mb-4'>You do not have any {filter === 'all'?'':filter + ' '}notifiations</p>}
            </div>
        </div>
    )
}
