const { Configuration, OpenAI } = require("openai");

const openaiMiddleware = async (req, res, next) => {
    if (req.whatsapp) {
        const api = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        try {
            const completion = await api.chat.completions.create({
                model: "gpt-4-1106-preview",
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
        } catch (e) {
            console.error("Erro ao interagir com a OpenAI: " + e);
            req.openaiResponse = "Desculpe, ocorreu um erro.";
        }
    }
    next();
};

module.exports = openaiMiddleware;
