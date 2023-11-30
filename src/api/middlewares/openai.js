const { Configuration, OpenAI } = require("openai");

const openaiMiddleware = async (req, res, next) => {
    console.log("chegou no openaiMiddleware")

    if (req.openaiResponse) {
        console.log("resposta já existe")
        next();
    } else {
        if (req.whatsapp) {
            console.log("foi pra ai responder")
            const api = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
    
            try {
                const completion = await api.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Você é a assistente inteligente da Borogoland."
                            // Adicione mais detalhes conforme necessário
                        },
                        {
                            role: "user",
                            content: req.whatsapp.msg_body,
                        },
                    ],
                });
    
                req.openaiResponse = completion.choices[0].message.content;

                console.log("Resposta:", req.openaiResponse);
            } catch (e) {
                console.error("Erro ao interagir com a OpenAI: " + e);
                req.openaiResponse = "Desculpe, pode repetir?";
            }
        }
        next();
    }
    
};

module.exports = openaiMiddleware;
