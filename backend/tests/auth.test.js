const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app.js')
const bcrypt = require('bcrypt')
const Utente = require('../models/utente')

let mongoServer


beforeAll(async () => {
    process.env.JWT_SECRET = 'gigaMegaSecret!!'
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
})

afterAll(async () =>{
    await mongoose.disconnect()
    await mongoServer.stop()
})

beforeEach(async () => {
    await Utente.deleteMany()
    jest.restoreAllMocks()
})



describe('POST /api/auth/login ', () => {

    beforeEach(async () => {
        const u = await Utente.create({
            username: 'test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10)
        })
    })

    test('login corretto, restituisce token, nome utene, ruolo e 200', async () => {
        const res = await request(app).post('/api/auth/login').send({ username: 'test', password: 'password' })
        
        expect(res.statusCode).toBe(200)
        expect(res.body.token).toBeDefined()
        expect(res.body.username).toBe('test')
        expect(res.body.ruolo).toBe('utente')
    })

    test('campo non compilato, restituisce 400', async () => {
        const res = await request(app).post('/api/auth/login').send({ username: 'test' })
        
        expect(res.statusCode).toBe(400)
    })

    test('password non corretta, restituisce 401', async () => {
        const res = await request(app).post('/api/auth/login').send({ username: 'test', password: 'key' })
        
        expect(res.statusCode).toBe(401)
    })

    test('username non corretto, restituisce 401', async () => {
        const res = await request(app).post('/api/auth/login').send({ username: 'user', password: 'password' })
        
        expect(res.statusCode).toBe(401)
    })

    test('errore interno del server, restisuice 500', async () => {
        jest.spyOn(Utente, 'findOne').mockRejectedValue()

        const res = await request(app).post('/api/auth/login').send({ username: 'test', password: 'password' })
        expect(res.statusCode).toBe(500)
    })
})


// ----------------


describe('POST /api/auth/register', () => {
    test('registrazione corretta, restituisce 201', async () => {
        const utente = {
            username: 'test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10)
        }

        const res = await request(app).post('/api/auth/register').send(utente)
        expect(res.statusCode).toBe(201)
        expect(res.body.ruolo).toBe('utente')
    })

    test('campo non compilato, restituisce 400', async () => {
        const res = await request(app).post('/api/auth/register').send({ username: 'test' })
        
        expect(res.statusCode).toBe(400)
    })

    test('username già esistente, restituisce 409', async () => {
        await Utente.create({
            username: 'test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10)
        })

        const utenteNew = {
            username: 'test',
            email: 'newMail@example.com',
            password: await bcrypt.hash('password', 10)
        }

        const res = await request(app).post('/api/auth/register').send(utenteNew)
        expect(res.statusCode).toBe(409)
    })

    test('email già esistente, restituisce 409', async () => {
        await Utente.create({
            username: 'test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10)
        })

        const utenteNew = {
            username: 'user',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10)
        }

        const res = await request(app).post('/api/auth/register').send(utenteNew)
        expect(res.statusCode).toBe(409)
    })

    test('errore interno del server, restisuice 500', async () => {
        const utente = {
            username: 'test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10)
        }

        jest.spyOn(Utente, 'findOne').mockRejectedValue()

        const res = await request(app).post('/api/auth/register').send(utente)
        expect(res.statusCode).toBe(500)
    })
})