//REST Frontend - HTML kliens, az API elérésére és az adatbázis műveletekre


const apiUrl = 'http://localhost:3000/api/users'; //Az API elérési útvonala
const usersData = document.getElementById('usersData'); //Az output táblázat törzse

//Az API elérése és az adatok lekérése

//Az adatok lekérésére szolgáló függvény
async function getUsers() {
    try {
        const response = await fetch(apiUrl); //Kapcsolódás az API-hoz
        const users = await response.json(); //Az adatok lekérése az API-tól (a users egy tömb)
        
        //A user egy objektum
        usersData.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.city}</td>
                <td>${user.address}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${user.gender}</td>
                <td>
                <button>Módisítás</button>
                <button>Törlés</button>
                </td>
            </tr>
            `).join('');

    }
    catch(e) {
            console.error(e.message); //Hibaüzenet küldése a konzolra - fejlesztéshez
            alert('Hiba történt az adatok elérése során!');
    }
}

//Adatok küldése az API-nak
//Az űrlap adatok összegyűjtése
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault(); //Az alapértelmezett űrlap viselkedés letiltása

    try {
        const formData = new FormData(e.target); //Az űrlap adatainak az elérése
        const data = Object.fromEntries(formData); //A data objektum tárolja az input mezőket

        //Az input elemek kitöltöttségének az ellenőrzése
        if (!data.firstName || !data.lastName || !data.city || !data.address || !data.phone || !data.email || !data.gender) {
            alert('Hiányző adatok!, Kérem, hogy minden mezőt töltsön ki!')
        } else {
            const response = await fetch(apiUrl,  {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            //Várunk a szerver(API) válaszára
            const result = await response.json();

            //Az API válaszától függően...
            if (response.ok) {
                alert(result.message);
                getUsers(); //A táblázat frissítése
            } else {
                alert(result.message);
            }
            e.target.reset();
        }

    }
    catch (error) {
        alert(error.message);
    }
})

//Felhasználói adatok törlése
async function deleteUser(id){
    if (confirm('Valóban törölni szeretné a felhasználót?')) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                getUsers(); //A táblázat frissítése
            } else {
                alert('Hiba történt a felhasználó törlése során!');
            }
        } catch (error) {
            alert(error.message);
        }
    }
}
    


getUsers(); //Az adatok lekérésére szolgáló függvény meghívása
