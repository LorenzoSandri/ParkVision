const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app.js')
const Parco = require('../models/parco')

let mongoServer

describe('API parchi', () => {
    
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
        await Parco.deleteMany()
        jest.restoreAllMocks()
    })


    // ------------ 
    // METODI GET

    test('GET /api/parchi | database vuoto, restituisce la lista vuota e 200', async () => {
        const res = await request(app).get('/api/parchi')

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(0)
    })

    test('GET /api/parchi | database con più parchi, restituisce la lista e 200', async () => {
        await Parco.create([
            {
                nome: 'Parco 1',
                zona: 'Zona 1',
                info: 'Info 1',
                coords: { type: 'MultiPolygon', coordinates: [[[[0,0],[0,1],[1,1],[1,0],[0,0]]]] }
            },
            {
                nome: 'Parco 2',
                zona: 'Zona 2',
                info: 'Info 2',
                coords: { type: 'MultiPolygon', coordinates: [[[[0,0],[0,1],[1,1],[1,0],[0,0]]]] }
            }
        ])

        const res = await request(app).get('/api/parchi')
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(2)
    })

    test('GET /api/parchi | errore interno del server, restisuice 500', async () => {
        jest.spyOn(Parco, 'find').mockRejectedValue()

        const res = await request(app).get('/api/parchi')
        expect(res.statusCode).toBe(500)
    })


    // ------------
    // METODI POST

    test('POST /api/parchi | crea un nuovo parco con dati validi, restituisce il parco e 201', async () => {
        const newParco = {
            nome: 'Parco 1',
            zona: 'Zona 1',
            info: 'Info 1',
            coords: { type: 'MultiPolygon', coordinates: [[[[0,0],[0,1],[1,1],[1,0],[0,0]]]] },
            fontane: true
        }

        const res = await request(app).post('/api/parchi').send(newParco)
        expect(res.statusCode).toBe(201)
        expect(res.body.fontane).toBe(true)
    })

    test('POST /api/parchi | dati obbligatori mancanti, restituisce 500', async () => {
        const res = await request(app).post('/api/parchi').send({ nome: 'Parco 1', zona: 'Zona 1'})
        expect(res.statusCode).toBe(500)
    })

    test('POST /api/parchi | dati non validi, restituisce 500', async () => {
        const res = await request(app).post('/api/parchi').send({ nome: 'Parco 1', zona: 'Zona 1', info: 'Info 1', coords: 15 })
        expect(res.statusCode).toBe(500)
    })

    test('POST /api/parchi | errore interno del server, restisuice 500', async () => {
        const newParco = {
            nome: 'Parco 1',
            zona: 'Zona 1',
            info: 'Info 1',
            coords: { type: 'MultiPolygon', coordinates: [[[[0,0],[0,1],[1,1],[1,0],[0,0]]]] }
        }
        jest.spyOn(Parco.prototype, 'save').mockRejectedValue()

        const res = await request(app).post('/api/parchi').send(newParco)
        expect(res.statusCode).toBe(500)
    })


    // ------------
    // METODI PUT

    test('PUT /api/parchi/:id | aggiorna un parco con dati validi, restituisce 200', async () => {
        const parco = await Parco.create({
            nome: 'Parco 1',
            zona: 'Zona 1',
            info: 'Info 1',
            coords: { type: 'MultiPolygon', coordinates: [[[[0,0],[0,1],[1,1],[1,0],[0,0]]]] }
        })

        const res = await request(app).put(`/api/parchi/${parco._id}`).send({ nome: 'Nuovo nome', zona: 'Nuova zona' })
        expect(res.statusCode).toBe(200)
        expect(res.body.nome).toBe('Nuovo nome')
    })

    test('PUT /api/parchi/:id | ID non esistente, restituisce 400', async () => {
        const id = new mongoose.Types.ObjectId()
        const res = await request(app).put(`/api/parchi/${id}`).send({ nome: 'Parco 1', zona: 'Zona 1'})
        expect(res.statusCode).toBe(404)
    })

    test('PUT /api/parchi/:id | dati non validi, restituisce 500', async () => {
        const parco = await Parco.create({
            nome: 'Parco 1',
            zona: 'Zona 1',
            info: 'Info 1',
            coords: { type: 'MultiPolygon', coordinates: [[[[0,0],[0,1],[1,1],[1,0],[0,0]]]] }
        })

        const res = await request(app).put(`/api/parchi/${parco._id}`).send({ coords: 15})
        expect(res.statusCode).toBe(500)
    })

    test('PUT /api/parchi/:id | errore interno del server, restisuice 500', async () => {
        const parco = await Parco.create({
            nome: 'Parco 1',
            zona: 'Zona 1',
            info: 'Info 1',
            coords: { type: 'MultiPolygon', coordinates: [[[[0,0],[0,1],[1,1],[1,0],[0,0]]]] }
        })
        jest.spyOn(Parco, 'findByIdAndUpdate').mockRejectedValue()

        const res = await request(app).put(`/api/parchi/${parco._id}`).send({ nome: 'Nuovo nome', zona: 'Nuova zona' })
        expect(res.statusCode).toBe(500)
    })



    // ------------
    // METODI DELETE

    test('DELETE /api/parchi/:id | elimina un parco con ID valido, restituisce 204', async () => {
        const parco = await Parco.create({
            nome: 'Parco 1',
            zona: 'Zona 1',
            info: 'Info 1',
            coords: { type: 'MultiPolygon', coordinates: [[[[0,0],[0,1],[1,1],[1,0],[0,0]]]] }
        })

        const res = await request(app).delete(`/api/parchi/${parco._id}`)
        expect(res.statusCode).toBe(204)
    })

    test('DELETE /api/parchi/:id | ID non esistente, restituisce 404', async () => {
        const id = new mongoose.Types.ObjectId()
        const res = await request(app).delete(`/api/parchi/${id}`)
        expect(res.statusCode).toBe(404)
    })

    test('DELETE /api/parchi/:id | errore interno del server, restisuice 500', async () => {
        const parco = await Parco.create({
            nome: 'Parco 1',
            zona: 'Zona 1',
            info: 'Info 1',
            coords: { type: 'MultiPolygon', coordinates: [[[[0,0],[0,1],[1,1],[1,0],[0,0]]]] }
        })
        jest.spyOn(Parco, 'findById').mockRejectedValue()

        const res = await request(app).delete(`/api/parchi/${parco._id}`)
        expect(res.statusCode).toBe(500)
    })

})