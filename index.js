const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors())
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234346" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  const id = (Math.floor(Math.random() * 1000000)).toString();

  const newPerson = { id, name, number };
  persons.push(newPerson);

  res.json(newPerson);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  // to check for missing fields
  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }

  // to check for duplicate names
  if (persons.find(p => p.name === name)) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  const id = (Math.floor(Math.random() * 1000000)).toString();
  const newPerson = { id, name, number };
  persons.push(newPerson);

  res.json(newPerson);
});

app.get('/', (req, res) => {
  res.send('<h1>Phonebook Backend API</h1><p>Available endpoints:</p><ul><li>GET /api/persons - List all persons</li><li>GET /api/persons/:id - Get person by ID</li><li>POST /api/persons - Add new person</li><li>DELETE /api/persons/:id - Delete person</li><li>GET /info - Show phonebook info</li></ul>');
});

app.get('/info', (req, res) => {
  const total = persons.length;
  const date = new Date();
  res.send(`<p>Phonebook has info for ${total} people</p><p>${date}</p>`);
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
