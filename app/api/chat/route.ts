import OpenAI from "openai";

import { OpenAIStream, StreamingTextResponse } from "ai"
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_APPLICATION_TOKEN,
    ASTRA_DB_API_ENDPOINT,
    OPENAI_API_KEY,
  } = process.env;

  const openai= new OpenAI({
    apiKey: OPENAI_API_KEY
  })

  const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
  const db = client.db(ASTRA_DB_API_ENDPOINT,{ namespace:ASTRA_DB_NAMESPACE})

  export async function POST(req:Request){
    try {
        const {messages}=await req.json()
        const latestMessage = messages[messages?.length -1]?.content
        let docContext = ""

        const embeddings=await openai.embeddings.create({
            model:"text-embedding-3-small",
            input: latestMessage,
            encoding_format:"float"
        })
        try{
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor=collection.find(null,{
                sort:{
                    $vector:embeddings.data[0].embedding,
                },
                limit:10
            })
            const documents= await cursor.toArray()

            const docsMap= documents?.map(doc =>doc.text)

            docContext=JSON.stringify(docsMap)
        } catch (error) {
            console.log("error Querying DB...", error)
            docContext=""
        }

        const template = {
          role: "system",
          content: `you are an AI assistant who knows everything about formula 1, use below context to augment what you know about formula one racing, the context will provide you with most recent page data from wikipedia
            fromat responses using markdown where applicable and dont return images
            
            -----------
            START CONTEXT
            ${docContext}
            END CONTEXT
            -----------
            QUESTION: ${latestMessage}
            -----------
            `,
        };
        const response= await openai.chat.completions.create({
            model:"gpt-4",
            stream:true,
            messages:[template, ...messages]
        })

        const stream=OpenAIStream(response)
        return new StreamingTextResponse(stream)
    } catch (error) {
       throw error
    }

  }
  

