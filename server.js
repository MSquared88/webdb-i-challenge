const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/api/accounts', (req, res) => {
	db.select("*").from('accounts')
		// db('accounts')
		.then(accounts => {
			res.status(200).json(accounts)
		})
		.catch(err => res.status(500).json(err))
})

server.get('/api/accounts/:id', validateAccountId, (req, res) => {
	db('accounts')
		.where("id", req.params.id)
		.first()
		.then(accounts => {
			res.status(200).json(accounts)
		})
		.catch(err => res.status(500).json(err))
})

server.post('/api/accounts', validateNewAccount, (req, res) => {
	const newPost = req.body

	db('accounts')
		.insert(newPost)
		.then(id => {
			res.status(200).json(id)
		})
		.catch(err => res.status(500).json(err))
})

server.put('/api/accounts/:id', validateAccountId, validateNewAccount, (req, res) => {
	const changes = req.body
	const id = req.params.id

	db('accounts')
		.where({ id: id })
		.update(changes, "id")
		.then(id => {
			res.status(200).json(id)
		})
		.catch(err => res.status(500).json(err))
})

server.delete('/api/accounts/:id', (req, res) => {
	id = req.params.id

	db('accounts')
		.where({ id: id })
		.del()
		.then(id => {
			res.status(200).json(id)
		})
		.catch(err => res.status(500).json(err))
})

function validateAccountId(req, res, next) {
	const id = req.params.id

	db('accounts')
		.where({id: id})
		.then(account => {
			if(!account.length){
				res.status(404).json({message: "The account with that id cannot be found."})
			}else  next()
		})

}

function validateNewAccount(req, res, next) {
	const newAccount = req.body

	if(!newAccount.name || !newAccount.budget){
		res.status(404).json({message: "name and budget are required fields"})
	}
	else next()
}


module.exports = server;