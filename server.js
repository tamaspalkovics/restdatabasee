const e = require('express');
const express = require('express');
const sqlite = require('sqlite3').verbose();//hibakeresés
const cors = require('cors');
const app= express();
const port= 3000;


//Middleware - köztes alkalmazások
app.use(express.json());
app.use(cors()); //Cross Origin Resource Sharing


//az adatbázis 
const db = new sqlite.Database('users.db', (err) =>{
    if(err) {
        console.log(err.message);
    }
    else {
        console.log('Az adatbázis kapcsolat létrejött.')
    }
})
//adatbázis séma létrehozása
db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    gender TEXT NOT NULL 
    )`);
//POST végpont az adatok mentésére a users táblában 
app.post('/api/users',(req,res) =>{
    //adatok elérése
    const {firstName, lastName, city, address, phone, email, gender}= req.body;

    const sql = 'INSERT INTO users (firstName, lastName, city, address, phone, email, gender) VALUES(?,?,?,?,?,?,?)'
    db.run(sql, [firstName, lastName, city, address, phone, email, gender],
    function(err){
        if (err) {
            console.log(err);
            return res.status(500).json({error: "Hiba történt"});
        }
        else {
            res.status(200).send({message: 'Adatok sikeresen rögzítése', id: this.lastID,firstName, lastName, city, address, phone, email, gender});
        }
    })
})

//Get végpont az adatbázis lekérésére
app.get('/api/users', (req,res) =>{
   db.all('SELECT * FROM users', [], (err, records) =>{
        if (err) {
            console.error(err);
            return res.status(500).json({message: 'Hiba történt az adatok kiolvasása során'});
        }
        else {
            return res.status(200).json(records);
        }
    })
})

//DELETE végpont az adatbázis egy sorának (id szerinti) törlésére
app.delete('/api/users/:id', (req, res) => {
    //id elérése az URL paraméter listából
    const { id } = req.params;

    //Az adatbázis egy sorának a törlése
    db.run('DELETE FROM users WHERE id = ?', [id],
    function(err){
        if (err) {
            return res.status(500).send(err.message);
        }
        else {
            return res.status(200).send({message: 'Sikeres törlés'});
        }
    })
})

//PUT a tábla adatainak módosítására
app.put('/api/users/:id', (req, res) => {
    //id elérése az URL paraméter listából
    const { id } = req.params;
    const { firstName, lastName, city, address, phone, email, gender } = req.body;

    const sql = `UPDATE users SET firstName = ?, lastName = ?, city = ?, address = ?, phone = ?, email = ?, gender = ? WHERE id = ?`;

    db.run(sql, [firstName, lastName, city, address, phone, email,  gender, id],
        //Callback függvény a frissítés eredményének kezelésére
    function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json(err.message);
        } else {
            return res.status(200).json({ message: 'A felhasználó frissítése megtörtént', id, firstName, lastName, city, address, phone, email, gender});
        }
    }
)
})

//Szerver indítása


    app.listen(port, () => {
        console.log(`A szerver fut a htttp://localhost: ${port} címen`);
    })
