"use client"

import Image from "next/image"
import f1GPTlogo from "./assets/images/f1gpt.png"

import {useChat} from "ai/react"

import {Message} from "ai"
// import { main } from "ts-node/dist/bin"

import Bubble from "./components/Bubble"
import PrompSuggestionRow from "./components/PromptSuggestionRow"
import LoadingBubble from "./components/LoadingBubble"

const Home =() =>{
    const {append, isLoading, messages, input, handleInputChange, handleSubmit}= useChat()
    const noMessage = !messages || messages.length ===0

    const handlePrompt=(promptText) =>{
        const msg: Message={
            id: crypto.randomUUID(),
            content:promptText,
            role:"user"

        }
        append(msg)
    }
    return (
      <main>
        <Image src={f1GPTlogo} width="250" alt="F1GPT logo" />
        <section className={noMessage ?"" :"populated"}>
          {noMessage ? (
            <>
              <p className="starter-text">ASK any f1 qns. we hope you enjoy!</p>
              <br/>
              <PrompSuggestionRow onPromptClick={handlePrompt}/>
            </>
          ) : (
            <>
           (
            { messages.map((message, index) => <Bubble key={`message- ${index}`} message={message}/>)}
            {isLoading&&<LoadingBubble/>}
            </>
          )}
        
        </section>
        <form onSubmit={handleSubmit}>
            <input className="question-box" onChange={handleInputChange} value={input} placeholder ="Ask me something"/>
            <input type="submit"/>
          </form>
      </main>
    );
}

export default Home
