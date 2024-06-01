"use client"

import Image from "next/image"
import HomeCard from "./HomeCard"
import { useState } from "react"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { toast } from "./ui/use-toast"
import { Toast } from "./ui/toast"
import { Textarea } from "./ui/textarea"
import ReactDatePicker from "react-datepicker"


const MeetingTypeList = () => {

    
    const [MeetingState, setMeetingState] = useState<"isSchedulingMeeting"|"isJoiningMeeting" |"isInstantMeeting"|undefined>()
    
    const router=useRouter()
    const {user}=useUser();
    const client=useStreamVideoClient();
    const [values,setValues]=useState({
        dateTime:new Date(),
        description:"",
        link:"",
    } )
    const [callDetails, setcallDetails] = useState<Call>()
    

    const CreateMeeting=async()=>{
        if(!user || !client) throw new Error('User and Client is required');
        try{
            if(!values.dateTime) toast({title:"Please select a date and time"})
            const id=crypto.randomUUID()
            const call=client.call("default",id);
            if(!call) throw new Error('Call failed');
            const startsAt=values.dateTime.toISOString();
            const description=values.description || "Instant Meeting";
            await call.getOrCreate(
                {data:{
                    starts_at:startsAt,
                    custom:{
                        description,
                    }
                }}
            )
            setcallDetails(call);
            if(!values.description){
                router.push(`/meeting/${id}`)
            }
            toast({title:"Meeting Created"})
        }catch(e){
            console.log(e);
            toast({title:"Failed to create meeting :("})
        }

    }

    const meetingLink=`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
            img={"icons/add-meeting.svg"}
            title={"New Meeting"}
            description={"Start An Instant Meeting"}
            color={"bg-orange-1"}
            handleClick={()=>{setMeetingState("isInstantMeeting")}}
        />
        <HomeCard
            img={"icons/schedule.svg"}
            title={"Schedule Meeting"}
            description={"Plan Your Meeting"}
            color={"bg-blue-1"}
            handleClick={()=>{setMeetingState("isSchedulingMeeting")}}
        />

        <HomeCard
            img={"icons/recordings.svg"}
            title={"View Recordings"}
            description={"Check Out Your Recordings"}
            color={"bg-purple-1"}
            handleClick={()=>{router.push("/recordings")}}
        />
        
        <HomeCard
            img={"icons/join-meeting.svg"}
            title={"Join Meeting"}
            description={"Via Invitation Link"}
            color={"bg-yellow-1"}
            handleClick={()=>{setMeetingState("isJoiningMeeting")}}
        />

    {!callDetails?(
        <MeetingModal
            isOpen={MeetingState==="isSchedulingMeeting"}
            onClose={()=>{setMeetingState(undefined)}}
            title="Create Meeting"
            handleClick={()=>{CreateMeeting()}}
        >
            <div className="flex flex-col gap-2.5">
                <label className="text-base text-normal leading-[22px] text-sky-2">Add a description</label>
                <Textarea className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e)=>setValues({...values,description:e.target.value})}/>
            </div>
            <div className="flex w-full flex-col gap-2.5">
                <label className="text-base text-normal leading-[22px] text-sky-2">Select Date and Time</label>
                <ReactDatePicker    
                    selected={values.dateTime}
                    onChange={(date:Date)=>setValues({...values,dateTime:date!})}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full rounded bg-dark-2 p-2 focus:outline-none"/>
            </div>
        </MeetingModal>    
    ):(
        <MeetingModal
            isOpen={MeetingState==="isSchedulingMeeting"}
            onClose={()=>{setMeetingState(undefined)}}
            title="Meeting Created"
            className="text-center"
            handleClick={()=>{
                navigator.clipboard.writeText(meetingLink);
                toast({title:"Link Copied"})
            }}
            image="/icons/checked.svg"
            buttonIcon="/icons/copy.svg"
            buttonText="Copy Meeting Link"
        />

    )}

    <MeetingModal
        isOpen={MeetingState==="isInstantMeeting"}
        onClose={()=>{setMeetingState(undefined)}}
        title="Start An Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={()=>{CreateMeeting()}}
    />

    <MeetingModal
        isOpen={MeetingState==="isJoiningMeeting"}
        onClose={()=>{setMeetingState(undefined)}}
        title="Enter Link Here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={()=>{router.push(values.link)}}
    >
        <input type="text" className="w-full rounded bg-dark-2 p-2 focus:outline-none" placeholder="Enter Meeting Link" onChange={(e)=>setValues({...values,link:e.target.value})}/>
    </MeetingModal>

    </section>
  )
}

export default MeetingTypeList