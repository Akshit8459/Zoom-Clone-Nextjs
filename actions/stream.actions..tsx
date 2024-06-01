"use server"

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey=process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret=process.env.STREAM_SECRET_KEY;

export const tokenProvider=async()=>{
    const user=await currentUser();
    if(!user) throw new Error('User not found');
    if(!apiKey) throw new Error('Stream API Key is required');
    if(!apiSecret) throw new Error('Stream Secret Key is required');
    const client= new StreamClient(apiKey,apiSecret,{timeout:3000});
    //expiration of token
    const exp=Math.round(Date.now()/1000)+60*60;
    //token issue time
    const isIssued=Math.round(Date.now()/1000)-60;

    const token=client.createToken(user.id,exp,isIssued);
    return token;
    
}