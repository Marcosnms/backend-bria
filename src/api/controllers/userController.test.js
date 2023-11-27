const bcrypt = require('bcrypt');
const userController = require('./userController');

test('should hash the private key', async () => {
    const privateKey = 'myPrivateKey';
    const hashedPassword = await bcrypt.hash(privateKey, 10);
    console.log(hashedPassword)

    // Add your assertions here to verify if the hashing is working correctly
});

const req = {
    body: {
        name: 'John Doe',
        whatsappNumber: '1234567890',
        privateKey: 'myPrivateKey',
    },
};

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

const hashedPassword = await bcrypt.hash(req.body.privateKey, 10);

const newUser = {
    name: req.body.name,
    whatsappNumber: req.body.whatsappNumber,
    privateKey: hashedPassword,
    createdAt: new Date(),
};

res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });

test('should login a user', async () => {
    // Create a mock request and response objects
    const req = {};
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    // Call the loginUser function
    await userController.loginUser(req, res);

    // Add your assertions here to verify if the user was logged in correctly
});