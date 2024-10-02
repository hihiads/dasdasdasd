require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');   
const app = express();

// Povezivanje s MongoDB koristeći varijablu iz .env datoteke
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Povezan s MongoDB'))
  .catch(err => console.log(err));

// Postavljanje sesija i flash poruka
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// Body-parser za rad s formama
app.use(bodyParser.urlencoded({ extended: false }));

// Postavljanje EJS kao view engine
app.set('view engine', 'ejs');

// Javna mapa za statičke datoteke (CSS, slike)
app.use(express.static('public'));

// Model korisnika
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

// Rute
app.get('/', (req, res) => {
  res.render('index', { botName: "SD Bot" });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Ime: ${name}, Email: ${email}, Poruka: ${message}`);
  res.send('Poruka poslana!');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  newUser.save(err => {
    if (err) return res.send('Greška kod registracije.');
    res.redirect('/login');
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.send('Korisnik ne postoji.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.send('Kriva lozinka.');
  }

  req.session.user = user;
  res.redirect('/');
});

app.use((req, res) => {
  res.status(404).render('404');
});

// Pokretanje servera
app.listen(3000, () => {
  console.log('Server pokrenut na portu 3000');
});
// GET ruta za prikaz kontakt forme
app.get('/contact', (req, res) => {
    res.render('contact');
  });
  
  // POST ruta za obradu kontakt forme
  app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // Logika za obradu poruke (npr. slanje na email, pohrana u bazu itd.)
    console.log(`Ime: ${name}, Email: ${email}, Poruka: ${message}`);
    
    // Povratna informacija korisniku
    res.send('Poruka uspješno poslana! Hvala što ste nas kontaktirali.');
  });
  

