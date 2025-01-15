'use client'

import { useEffect, useRef } from 'react'

import { useAppDispatch, useAppSelector } from '@/store/store'
import { selectAiSlice, setHydrate } from '@/store/aiSlice'
import ChatMessage from '@/components/ai-agent/ChatMessage'
import ChatNav from '@/components/ai-agent/ChatNav'
import ChatInput from '@/components/ai-agent/ChatInput'
import { useAccount } from 'wagmi'

const Home = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiSlice = useAppSelector(selectAiSlice);
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  
  useEffect(() => {
    if(aiSlice.messages.length === 0) {
      dispatch(setHydrate({ address }))
    }
  }, [dispatch, address, aiSlice.messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiSlice.messages])

  return (
    <div className="flex-1 container mx-auto max-w-4xl mt-4 px-4 flex flex-col">
      <ChatNav />
      <main className="flex-1 space-y-6 py-6 overflow-y-auto">
        {aiSlice.messages.map((message, index) => (
          <ChatMessage message={message} key={index} />
        ))}
        <div ref={messagesEndRef} />
      </main>
      <ChatInput />
    </div>
  )
}

export default Home;
