"use client"
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useGetCallsById } from '@/hooks/useGetCallsById';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React from 'react'

const Table=({title,description}:{title:string;description:string})=>{
    return (
        <div className="flex flex-col items-start gap-2 xl:flex-row">
            <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">{title}</h1>
            <h1 className=' truncate text-sm font-bold max-sm:max-w-[320px] lg:text-lg'>{description}</h1>
        </div>
    )
}

const personalRoom = () => {

  const router=useRouter()
  const { user }=useUser()
  const meetingId= user?.id;
  const meetingLink=`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`
  const client=useStreamVideoClient();
  const {call}=useGetCallsById(meetingId!);
  const startRoom=async()=>{
    if(!user || !client) throw new Error('User and Client is required');
    if(!call){
      const newCall=client.call('default',meetingId!);
      await newCall.getOrCreate(
        {data:{
            starts_at:new Date().toISOString(),
        }})
    }
    router.push(`/meeting/${meetingId}?personal=true`)
  }

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Personal Rooms
      </h1>
      <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
        <Table title='topic:' description={`${user?.username?.toUpperCase()}'s meeting room`}/>
        <Table title='Meeting Id:' description={`${meetingId}`}/>
        <Table title='Invite Link:' description={`${meetingLink}`}/>
      </div>
      <div className='flex gap-5'>
        <Button className='bg-dark-1' onClick={()=>{navigator.clipboard.writeText(meetingLink);toast({title:"Link Copied!"})}}>Copy Invite Link</Button>
        <Button className='bg-blue-1' onClick={()=>{startRoom()}}>Start Meeting</Button>
      </div>
    </section>
  )
}

export default personalRoom