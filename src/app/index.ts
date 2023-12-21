import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";

try {
  const result = await fetch("devdocs.txt");
  const text= await result.text();
  const splitter = new RecursiveCharacterTextSplitter();
  const output = await splitter.createDocuments([text]);
  console.log(output);

} catch (e) {
  console.log(e);
}
