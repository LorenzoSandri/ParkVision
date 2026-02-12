const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app.js')
const Intervento = require('../models/intervento')

let mongoServer

describe('API interventi', () => {

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
        await Intervento.deleteMany()
        jest.restoreAllMocks()
    })


    // ------------ 
    // METODI GET

    test('GET /api/interventi | database vuoto, restituisce la lista vuota e 200', async () => {
        const res = await request(app).get('/api/interventi')

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(0)
    })

    test('GET /api/interventi | database con più interventi. restituisce la lista e 200', async () => {
        await Intervento.create([
            {
                parco_id: new mongoose.Types.ObjectId(),
                dataPrevista: new Date(),
                tipo: 'taglio erba',
                info: 'Info 1',
                responsabile: 'R 1'
            },
            {
                parco_id: new mongoose.Types.ObjectId(),
                dataPrevista: new Date(),
                tipo: 'potatura',
                info: 'Info 2',
                responsabile: 'R 2'
            }
        ])

        const res = await request(app).get('/api/interventi')
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(2)
    })

    test('GET /api/interventi | errore interno del server, restisuice 500', async () => {
        jest.spyOn(Intervento, 'find').mockRejectedValue()

        const res = await request(app).get('/api/interventi')
        expect(res.statusCode).toBe(500)
    })


    // ------------ 
    // METODI POST

    test("POST /api/interventi | crea un nuovo intervento con dati validi, restituisce l'intervento e 201", async () => {
        const newIntervento = {
            parco_id: new mongoose.Types.ObjectId(),
            dataPrevista: new Date(),
            tipo: 'taglio erba',
            info: 'Info 1',
            responsabile: 'R 1'
        }

        const res = await request(app).post('/api/interventi').send(newIntervento)
        expect(res.statusCode).toBe(201)
    })

    test('POST /api/interventi | dati obbligatori mancanti, restituisce 500', async () => {
        const res = await request(app).post('/api/interventi').send({ info: 'Info 1' })
        expect(res.statusCode).toBe(500)
    })

    test('POST /api/interventi | dati non validi, restituisce 500', async () => {
        const res = await request(app).post('/api/interventi').send({
            parco_id: new mongoose.Types.ObjectId(),
            dataPrevista: 'oggi',
            tipo: 'taglio erba',
            info: 'Info 1',
            responsabile: 'R 1'
        })
        expect(res.statusCode).toBe(500)
    })
    
    test('POST /api/interventi | errore interno del server, restisuice 500', async () => {
        const newIntervento = {
            parco_id: new mongoose.Types.ObjectId(),
            dataPrevista: new Date(),
            tipo: 'taglio erba',
            info: 'Info 1',
            responsabile: 'R 1'
        }
        jest.spyOn(Intervento.prototype, 'save').mockRejectedValue()

        const res = await request(app).post('/api/interventi').send(newIntervento)
        expect(res.statusCode).toBe(500)
    })


    // ------------ 
    // METODI PUT

    test('PUT /api/interventi/:id | aggiorna un intervento con dati validi, restituisce 200', async () => {
        const intervento = await Intervento.create({
            parco_id: new mongoose.Types.ObjectId(),
            dataPrevista: new Date(),
            tipo: 'taglio erba',
            info: 'Info 1',
            responsabile: 'R 1'
        })

        const res = await request(app).put(`/api/interventi/${intervento._id}`).send({ info: 'Nuove info' })
        expect(res.statusCode).toBe(200)
        expect(res.body.info).toBe('Nuove info')
    })

    test('PUT /api/interventi/:id | ID non esistente, restituisce 404', async () => {
        const id = new mongoose.Types.ObjectId()
        const res = await request(app).put(`/api/interventi/${id}`).send({ info: 'Nuove info'})
        expect(res.statusCode).toBe(404)
    })

    test('PUT /api/interventi/:id | dati non validi, restituisce 500', async () => {
        const intervento = await Intervento.create({
            parco_id: new mongoose.Types.ObjectId(),
            dataPrevista: new Date(),
            tipo: 'taglio erba',
            info: 'Info 1',
            responsabile: 'R 1'
        })

        const res = await request(app).put(`/api/interventi/${intervento._id}`).send({ dataPrevista: 'oggi' })
        expect(res.statusCode).toBe(500)
    })

    test('PUT /api/interventi/:id | errore interno del server, restisuice 500', async () => {
        const intervento = await Intervento.create({
            parco_id: new mongoose.Types.ObjectId(),
            dataPrevista: new Date(),
            tipo: 'taglio erba',
            info: 'Info 1',
            responsabile: 'R 1'
        })
        jest.spyOn(Intervento, 'findByIdAndUpdate').mockRejectedValue()

        const res = await request(app).put(`/api/interventi/${intervento._id}`).send({ info: 'Nuove info' })
        expect(res.statusCode).toBe(500)
    })


    // ------------
    // METODI DELETE

    test('DELETE /api/interventi/:id | elimina un intervento con ID valido, restituisce 204', async () => {
        const intervento = await Intervento.create({
            parco_id: new mongoose.Types.ObjectId(),
            dataPrevista: new Date(),
            tipo: 'taglio erba',
            info: 'Info 1',
            responsabile: 'R 1'
        })

        const res = await request(app).delete(`/api/interventi/${intervento._id}`)
        expect(res.statusCode).toBe(204)
    })

    test('DELETE /api/interventi/:id | ID non esiste, restituisce 404', async () => {
        const id = new mongoose.Types.ObjectId()
        const res = await request(app).delete(`/api/interventi/${id}`)
        expect(res.statusCode).toBe(404)
    })

    test('DELETE /api/interventi/:id | errore interno del server, restisuice 500', async () => {
        const intervento = await Intervento.create({
            parco_id: new mongoose.Types.ObjectId(),
            dataPrevista: new Date(),
            tipo: 'taglio erba',
            info: 'Info 1',
            responsabile: 'R 1'
        })
        jest.spyOn(Intervento, 'findByIdAndDelete').mockRejectedValue()

        const res = await request(app).delete(`/api/interventi/${intervento._id}`)
        expect(res.statusCode).toBe(500)
    })
    
})