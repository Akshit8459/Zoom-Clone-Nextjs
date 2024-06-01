import MeetingTypeList from '@/components/MeetingTypeList';
import React from 'react'

const Home = () => {
  const date= new Date();
  const time=date.toLocaleTimeString("en-US",{hour12:true,hour:'2-digit',minute:'2-digit'});
  const day=date.toLocaleDateString("en-US",{weekday:'long',day:'2-digit',month:"long",year:'numeric'});
  return (
    <section className='flex flex-col size-full gap-10 text-white'>
      <div className='h-[303px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <h2 className='glassmorphism max-w-[273px] rounded py-2 text-center font-normal text-base'>Upcoming Meeting at 11:00pm</h2>
          <div className='flex flex-col gap-2'>
            <h1 className=' text-4xl font-extrabold lg:text-7xl'> {time}</h1>
            <p className='text-lg font-medium lg:text-2xl text-sky-1'>{day}</p>
          </div>
        </div>
        
        <MeetingTypeList />

      </div>
    </section>
  )
}

export default Home