const express = require('express')
const expressGraphql = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`
	type Query {
		equipes: [EquipesDeFormula1],
		piloto(nome: String): Piloto
	},
	type EquipesDeFormula1 {
		id: Int
		nome: String
		nacionalidade: String
		titulos: Int
		piloto: Piloto
	},
	type Piloto {
		nome: String,
		idade: Int
	},
	type Mutation {
		atualizarEquipe(id: Int!, titulos: Int!): EquipesDeFormula1
	}
`)

const equipes_ = [
	{
		id: 44,
		nome: 'Mercedes AMG F1',
		nacionalidade: 'Britânica',
		titulos: 5,
		piloto: {
			nome: 'Lewis',
			idade: 34
		}
	},
	{
		id: 16,
		nome: 'Scuderia Ferrari F1',
		nacionalidade: 'Italiana',
		titulos: 16,
		piloto: {
			nome: 'Leclerc',
			idade: 21
		}
	}
]

const atualizarEquipe = function ({id, titulos}) {
	equipes_.map( equipe => {
		if (equipe.id === id) {
			equipe.titulos += titulos
		}
		return equipe
	})
	return equipes_.filter( equipe => equipe.id === id)[0]
}

const root = {
	equipes: () => equipes_,
	piloto: (args) => equipes_.find( item => item.piloto.nome === args.nome).piloto,
	atualizarEquipe: atualizarEquipe
}

const app = express()

app.use('/graphql', expressGraphql({
	schema: schema,
	rootValue: root,
	graphiql: true
}))

app.listen(4446, () => console.log(`Running`))