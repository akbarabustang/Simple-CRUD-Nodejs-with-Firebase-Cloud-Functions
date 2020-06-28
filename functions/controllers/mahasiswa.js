const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const mahasiswa = express()

//create a service account and get the key
// var serviceAccount = require('../configs/key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-9e6ba.firebaseio.com"
})

const db = admin.firestore()

mahasiswa.use(cors({ origin: true }))

mahasiswa.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

mahasiswa.post('/store', async (req, res) => {
    try {
        let data = req.body
        await db.collection('mahasiswa').add(data)

        res.status(201).send()
    } catch (error) {
        res.status(500).send(error)
    }
})

mahasiswa.get('/detail/:id', async (req, res) => {
    try {
        const doc = await db.collection('mahasiswa').doc(req.params.id).get()
        let response = doc.data()

        res.status(200).send(JSON.stringify(response))
    } catch (error) {
        res.status(500).send(error)
    }
})

mahasiswa.get('/all', async (req, res) => {
    try {
        const snapshot = await db.collection('mahasiswa').get()
        let mahasiswa = []

        snapshot.forEach(doc => {
            const selectedItem = {
                id: doc.id,
                item: doc.data()
            }
            mahasiswa.push(selectedItem)
        })
       
        res.status(200).send(JSON.stringify(mahasiswa))
    } catch (error) {
        res.status(500).send(error)
    }
})

mahasiswa.put('/update/:id', async (req, res) => {
    try {
        const document = await db.collection('mahasiswa').doc(req.params.id).update({
            nama: req.body.nama,
            alamat: req.body.alamat,
        })
   
        res.status(200).send()
    } catch (error) {
        res.status(500).send(error)
    }
})

mahasiswa.delete('/delete/:id', async (req, res) => {
    try {
        await db.collection('mahasiswa').doc(req.params.id).delete()
   
        res.status(200).send()
    } catch (error) {
        res.status(500).send(error)
    }
})


exports.mahasiswa = functions.https.onRequest(mahasiswa)