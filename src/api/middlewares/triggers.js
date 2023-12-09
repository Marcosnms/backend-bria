// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const optionService = require('../services/optionsService'); // Importe sua função optionService

// prisma.$use(async (params, next) => {
//   if (params.model === 'Interaction' && params.action === 'create') {
//     const result = await next(params);
//     if (result.type === 'CHEGADA') {
//       // Acione o optionService aqui
//       await optionService(/* parâmetros necessários */);
//     }
//     return result;
//   }
//   return next(params);
// });
