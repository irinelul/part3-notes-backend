const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('bodyLength', (req) =>  (JSON.stringify(req.body)).length) ;

app.use(morgan(':method :url  status :status - :response-time ms content: :body :bodyLength Length'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const generateId = () => {
  const maxId = Math.floor(Math.random() * 5555);
  return String(maxId) 
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body.name.toLowerCase)
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing. We require both body and number to be populated.' 
    })
  }
  if (persons.find(p=>p.name.toLowerCase()===body.name.toLowerCase())) {
    return response.status(400).json({ 
      error: `${body.name} already exists in the phonebook. 
      The name must be unique.`
    })
  } 
  const note = {
    name: body.name,
    number: String(body.number),
    id: generateId(),
  }

  persons = persons.concat(note)

  response.json(note)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
   res.send(`Phonebook has info for ${persons.length} persons <br>
    Info is correct as of  ${new Date().toISOString()}`   )
})


app.delete('/api/persons/:id', (request, response) => {
  const id = String(request.params.id)
  persons = persons.filter(note => note.id !== id)
  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = String(request.params.id)
  const note = persons.find(person => person.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
