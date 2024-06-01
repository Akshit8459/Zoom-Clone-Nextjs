// @ts-nocheck
"use client"
import { useGetCalls } from '@/hooks/useGetCall';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useRouter } from 'next/navigation';
import { toast } from './ui/use-toast';

const CallList = ({type}:{type: "upcoming" | "ended" | "recordings"}) => {
    const router=useRouter();
    const [callRecordings, setcallRecordings] = useState<CallRecording[]>([])
    const {upcomingCalls,endedCalls,recordings,isCallLoaded}=useGetCalls();


    // if(isCallLoaded) return <Loader/>

    const getCalls=()=>{
        switch(type){
            case "upcoming":
                return upcomingCalls;
            case "ended":
                return endedCalls;
            case "recordings":
                return callRecordings;
            default:
                return [];
        }
    }

    const getNoCallsMessage=()=>{
        switch(type){
            case "upcoming":
                return "no upcoming calls";
            case "ended":
                return "no previous calls";
            case "recordings":
                return "no recordings found";
            default:
                return [];
        }
    }

    useEffect(()=>{
        const fetchRecordings=async()=>{
            try{
                const  callData=await Promise.all(callRecordings.map(meeting=> meeting.queryRecordings()))
                const recordings=callData.filter(call=>call.recordings.length>0).flatMap(call=>call.recordings)
                setcallRecordings(recordings);
            }
            catch(e){
                toast({title:"Try Again Later",status:"error"})
            }
        }
        if(type==="recordings"){
            fetchRecordings();
        }
    },[type,callRecordings])
    
    const calls=getCalls();
    const noCallsMessage=getNoCallsMessage();

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        {
            calls && calls.length>0?
            calls.map((meeting : Call | CallRecording)=>{
                return (<MeetingCard 
                    key={(meeting as Call).id}
                    icon={
                        type==="ended"?
                        "/icons/previous.svg"
                        :type==="upcoming"?
                            "/icons/upcoming.svg"
                            :"/icons/recordings.svg"

                    }
                    title={
                        (meeting as Call).state?.custom?.description ||
                        (meeting as CallRecording).filename?.substring(0, 20) ||
                        'No Description'
                    }
                    date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
                    isPreviousMeeting={type==="ended" ? true : false}
                    buttonIcon1={type==="recordings"?'icons/play.svg':undefined}
                    buttonText={type==="recordings"?"Play":"start"}
                    link={type === "recordings" ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
                    handleClick={
                        type === 'recordings'
                        ? () => router.push(`${(meeting as CallRecording).url}`)
                        : () => router.push(`/meeting/${(meeting as Call).id}`)
                    }
                />)
            }):<h1>{noCallsMessage}</h1>
        }
        

    </div>
  )
}

export default CallList