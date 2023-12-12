// Passo 1: Preparar o Prompt para a OpenAI
const buildPromptWithFlows = (chatHistory, currentMessage) => {
    let prompt = "Você é a assistente inteligente da Borogoland.\n";
  
    // Adicionando mensagens do histórico ao prompt
    chatHistory.forEach(interaction => {
      const role = interaction.sender === 'user' ? 'user' : 'assistant';
      prompt += `${role}: ${interaction.message}\n`;
    });
  
    // Adicionando a mensagem atual
    prompt += `user: ${currentMessage}\n`;
  
    // Adicionando os marcadores dos fluxos
    prompt += `Fluxos: [ONBOARDING], [CONSULTAS], [PERFIL], [CURSOS], [MEMBROS], [EVENTOS], [SERVIÇOS], [WALLET]\n`;
    return prompt;
  };
  
  // Passo 2: Enviar o Prompt e Receber a Resposta da OpenAI
  const openaiMiddleware = async (req, res, next) => {
    const userId = req.userId;
    const chatHistory = await chatController.getChatHistory(userId, 5);
    const prompt = buildPromptWithFlows(chatHistory, req.whatsapp.msg_body);
  
    const api = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  
    try {
      const completion = await api.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{role: "system", content: prompt}],
      });
      
      const responseContent = completion.choices[0].message.content;

      // Passo 3: Analisar a Resposta e Determinar o Fluxo
      let flow = "99"; // Um valor padrão para o caso de não identificar um fluxo específico
  
      // Exemplo de análise de resposta (esta parte precisa ser adaptada conforme sua lógica específica)
      if (responseContent.includes("[ONBOARDING]")) {
        flow = "01";
      } else if (responseContent.includes("[CONSULTAS]")) {
        flow = "02";
      } else if (responseContent.includes("[PERFIL]")) {
        flow = "03";
      }
      // ... Adicione condições para outros fluxos ...
  
      // Configurar a resposta com base no fluxo determinado
      req.response = {
        message: responseContent, // A resposta real da OpenAI ou o menu de opções
        type: "text",
        flow: flow,
      };
  
      console.log("Resposta:", req.response);
  
      // Passo 4: Responder ao Usuário com a Orientação ou o Menu de Opções
      // Esta etapa é coberta pelo envio da resposta configurada acima
  
    } catch (e) {
      console.error("Erro ao interagir com a OpenAI: " + e);
      req.response = {
        message: "Desculpe, não entendi. Poderia repetir?",
        type: "text",
        flow: "99",
      };
    }
  
    // Salvar a resposta gerada e continuar o middleware
    console.log("salvando resposta");
    await chatController.saveReplyMessage(userId, req.response.message);
    await interactionController.saveUserInteraction(userId, "RESPOSTA", false);
  
    next();
  };
  
  module.exports = openaiMiddleware;