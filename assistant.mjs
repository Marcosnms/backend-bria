import { OpenAI } from "openai";

const api = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
try {
  const thread = await api.beta.threads.create();
  console.log(thread);
} catch (e) {
  console.error("Erro ao interagir com a OpenAI:", e);
  req.response = {
    message: "Desculpe, não entendi. Poderia repetir?",
    type: "text",
    flow: "99",
  };
}
