const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app.js')
const Segnalazione = require('../models/segnalazione')

let mongoServer

describe('API segnalazioni', () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await mongoose.connect(uri)
    })

    afterAll(async () =>{
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    beforeEach(async () => {
        await Segnalazione.deleteMany()
        jest.restoreAllMocks()
    })


    // ------------ 
    // METODI GET

    test('GET /api/segnalazioni | database vuoto, restituisce la lista vuota e 200', async () => {
        const res = await request(app).get('/api/segnalazioni')

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(0)
    })

    test('GET /api/segnalazioni | database con più segnalazioni, restituisce la lista e 200', async () => {
        await Segnalazione.create([
            {
                parco_id: new mongoose.Types.ObjectId(),
                data: new Date(),
                stato: false,
                info: 'Info 1',
                utente: 'U 1'
            },
            {
                parco_id: new mongoose.Types.ObjectId(),
                data: new Date(),
                stato: true,
                info: 'Info 2',
                utente: 'U 2'
            }
        ])

        const res = await request(app).get('/api/segnalazioni')
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(2)
    })

    test('GET /api/segnalazioni | errore interno del server, restisuice 500', async () => {
        jest.spyOn(Segnalazione, 'find').mockRejectedValue()

        const res = await request(app).get('/api/segnalazioni')
        expect(res.statusCode).toBe(500)
    })

    // ------------ 
    // METODI POST

    test('POST /api/segnalazioni | crea una nuova segnalazione con dati validi, restituisce la segnalazione e 201', async () => {
        const newSegnalazione = {
            parco_id: new mongoose.Types.ObjectId(),
            data: new Date(),
            stato: false,
            info: 'Info 1',
            utente: 'U 1'
        }

        const res = await request(app).post('/api/segnalazioni').send(newSegnalazione)
        expect(res.statusCode).toBe(201)
    })

    test('POST /api/segnalazioni | dati obbligatori mancanti, restituisce 500', async () => {
        const res = await request(app).post('/api/segnalazioni').send({ info: 'Info 1' })
        expect(res.statusCode).toBe(500)
    })

    test('POST /api/segnalazioni | dati non validi, restituisce 500', async () => {
        const res = await request(app).post('/api/segnalazioni').send({
            parco_id: new mongoose.Types.ObjectId(),
            data: 'oggi',
            stato: false,
            info: 'Info 1',
            utente: 'U 1'
        })
        expect(res.statusCode).toBe(500)
    })

    test('POST /api/segnalazioni | errore interno del server, restisuice 500', async () => {
        const newSegnalazione = {
            parco_id: new mongoose.Types.ObjectId(),
            data: new Date(),
            stato: false,
            info: 'Info 1',
            utente: 'U 1'
        }
        jest.spyOn(Segnalazione.prototype, 'save').mockRejectedValue()

        const res = await request(app).post('/api/segnalazioni').send(newSegnalazione)
        expect(res.statusCode).toBe(500)
    })


    // ------------ 
    // METODI PUT

    test('PUT /api/segnalazioni/:id | aggiorna una segnalazione con dati validi, restituisce 200', async () => {
        const segnalazione = await Segnalazione.create({
            parco_id: new mongoose.Types.ObjectId(),
            data: new Date(),
            stato: false,
            info: 'Info 1',
            utente: 'U 1'
        })

        const res = await request(app).put(`/api/segnalazioni/${segnalazione._id}`).send({ info: 'Nuove info' })
        expect(res.statusCode).toBe(200)
        expect(res.body.info).toBe('Nuove info')
    })

    test('PUT /api/segnalazioni/:id | ID non esistente, restituisce 404', async () => {
        const id = new mongoose.Types.ObjectId()
        const res = await request(app).put(`/api/segnalazioni/${id}`).send({ info: 'Nuove info'})
        expect(res.statusCode).toBe(404)
    })

    test('PUT /api/segnalazioni/:id | dati non validi, restituisce 500', async () => {
        const segnalazione = await Segnalazione.create({
            parco_id: new mongoose.Types.ObjectId(),
            data: new Date(),
            stato: false,
            info: 'Info 1',
            utente: 'U 1'
        })

        const res = await request(app).put(`/api/segnalazioni/${segnalazione._id}`).send({ data: 'oggi' })
        expect(res.statusCode).toBe(500)
    })

    test('PUT /api/segnalazioni/:id | errore interno del server, restisuice 500', async () => {
        const segnalazione = await Segnalazione.create({
            parco_id: new mongoose.Types.ObjectId(),
            data: new Date(),
            stato: false,
            info: 'Info 1',
            utente: 'U 1'
        })
        jest.spyOn(Segnalazione, 'findByIdAndUpdate').mockRejectedValue()

        const res = await request(app).put(`/api/segnalazioni/${segnalazione._id}`).send({ info: 'Nuove info' })
        expect(res.statusCode).toBe(500)
    })

})