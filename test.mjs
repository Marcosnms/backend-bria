import { parsePhoneNumber } from "libphonenumber-js";
import { OpenAI } from "openai";

const getLocation = async (whatsappNumber) => {
  const phoneNumber = parsePhoneNumber(`+${whatsappNumber}`);
  const country = phoneNumber.country;
  const number = phoneNumber.nationalNumber;
  const ddd = number.substring(0, 2);

  const api = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completionCity = await api.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "responda apenas o nome de 1 cidade. só 1 palavra. Se for um nome composto, traga o nome completo e sem o uso de pontuações",
        },
        {
          role: "user",
          content: `${ddd} é o DDD de qual cidade do ${country}?`,
        },
      ],
    });
    const cidade = completionCity.choices[0].message.content;
    console.log(cidade);

    const completionState = await api.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "responda apenas com a UF do estado",
        },
        {
          role: "user",
          content: `${cidade} pertence a qual estado do ${country}?`,
        },
      ],
    });
    const estado = completionState.choices[0].message.content;
    console.log(estado);

    const response = {
      city: cidade,
      state: estado,
      country: country,
    };
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// Exemplo de chamada da função
getLocation('556192672882'); // Substitua pelo número desejado
