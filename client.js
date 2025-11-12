//REST frontend - HTML kliens, az API elérésére és az adatbázis műveletekre

const apiUrl = 'http://localhost:3000/api/users';
const usersData = document.getElementById('usersData');

//Az API elérése és az adatok lekérése

async function getUsers() {
    try  {
        const response = await fetch(apiUrl); //Kapcsolódás az API-hoz
        const users = await response.json();
        usersData.innerHTML = users.map(user  => `
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
                    <button>Törlés</button>
                </td>
            </tr>
            `).join('');
    }
    catch (e) {
        console.error(e.message);
        alert('Hiba történt az adatok elérése során')

    }
}

//Adatok küldése az API-nak
//Az űrlap adatok gyűjtése
document.getElementById('userForm').addEventListener('submit', async(e) => {
    e.preventDefault(); //Az adatok lekérésére szolgáló függvény meghívása

    try {
        const formData = new FormData(e.target); //Az űrlap adatainak lekérése
        const data = Object.fromEntries(formData); //A data objektum tárolja az input mezők adatait

        //Az input elemk kitöltöttségének ellenőrzése
        if (data.firstName || data.lastName || data.city || data.address || data.phone || data.email || data.gender) {
            alert('Kérem töltse ki az összes mezőt!')
        }
    }
    catch (e) {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert(result.message);
            getUsers(); //Adatok újra lekérése és megjelenítése
        }
        else {
            alert(result.message);
        }
        e.target.reset(); //Űrlap mezők ürítése
    }
})
getUsers();