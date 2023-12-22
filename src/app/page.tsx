'use client';

// import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
// import {createClient} from '@supabase/supabase-js';
// import {SupabaseVectorStore} from 'langchain/vectorstores/supabase'
// import {OpenAIEmbeddings} from 'langchain/embeddings/openai'
import {FormEvent, useState} from "react";
import {ChatOpenAI} from "@langchain/openai";
import {PromptTemplate} from "@langchain/core/prompts";

export default function Home() {


  const [userInputValue, setUserInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("");
  const [arrayOfAppNames, setArrayOfAppNames] = useState<Array<string>>([]);
  const [fetchingData, setFetchingData] = useState<boolean>(false);

  // const sbApiKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY
  // const sbUrl = process.env.NEXT_PUBLIC_SB_URL;
  const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  // const runThisStupidFunction = async () => {
  //   try {
  //     const result = await fetch("/devdocs.txt");
  //     const text = await result.text();
  //     const splitter = new RecursiveCharacterTextSplitter({
  //       chunkSize: 600,
  //     });
  //
  //     const output = await splitter.createDocuments([text]);
  //
  //     const client = await createClient(sbUrl, sbApiKey)
  //     await SupabaseVectorStore.fromDocuments(
  //       output,
  //       new OpenAIEmbeddings({
  //         openAIApiKey: openAIKey
  //       }),
  //       {
  //         client,
  //         tableName: 'documents',
  //       }
  //     );
  //
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  const runThisOtherStupidFunction = (userInput: string) => {
    try {

      const llm = new ChatOpenAI({openAIApiKey: openAIKey});

      const nameTemplate = 'Generate 5 app names based on the following app function:{appFunction}';

      const namePrompt = PromptTemplate.fromTemplate(nameTemplate);

      const nameChain = namePrompt.pipe(llm);

      const response = nameChain.invoke({appFunction: userInput});

      return response.then(res => res.content);

    } catch (e) {
      console.log(e)
    }
  }

  const generateGreeting = () => {
    try {
      const llm = new ChatOpenAI({openAIApiKey: openAIKey});
      const greetingTemplate = 'Translate the word hello from English into a random language. Translation: ';

      const greetingPrompt = PromptTemplate.fromTemplate(greetingTemplate);
      const greetingChain = greetingPrompt.pipe(llm);
      const response = greetingChain.invoke({});
      return response.then(res => res.content);
    } catch (e) {
      console.log(e);
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setSearchQuery(userInputValue);
    setUserInputValue("");
    setFetchingData(true);
    event.preventDefault();
    generateGreeting()?.then(res => setGreeting(res.toString()));
    runThisOtherStupidFunction(userInputValue)?.then(res => setArrayOfAppNames(res.toString().split('\n')))
    setFetchingData(false);
  }

  return (
    <main className="h-screen p-6 w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold">App Name Generator</h1>
      <p>What is the main purpose of your app?</p>
      <form onSubmit={event => handleSubmit(event)} className="flex gap-6 p-4 justify-center">
        <input className="px-2 py-4 rounded-md" value={userInputValue} onChange={e => setUserInputValue(e.target.value)}/>
        <button type={"submit"} className="w-fit px-4 py-2 border-2 border-black mt-4 rounded-lg">Submit</button>
      </form>
      <button onClick={() => {
        setUserInputValue("");
        setArrayOfAppNames([]);
      }} className="w-fit px-4 py-2 border-2 border-black mt-4 rounded-lg">Clear</button>
      {
        fetchingData ? (

          <p>Hold on fetching results...</p>


        ) : (
          <ul className="flex flex-col items-center gap-2">
            {
              greeting && (<p>{greeting.slice(0, greeting.indexOf('('))}!! Here are some suggestions for app names related to <b className="underline text-red-500">{searchQuery}</b></p>)
            }
            {
              arrayOfAppNames.map(item => (
                <li>{item}</li>
              ))
            }
          </ul>
        )
      }
    </main>
  )
}
