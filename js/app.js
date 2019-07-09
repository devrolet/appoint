let DB;

const form = document.querySelector('form'),
             artistName = document.querySelector('#artist-name'),
             labelName = document.querySelector('#label-name'),
             phone = document.querySelector('#phone'),
             date = document.querySelector('#date'),
             hour = document.querySelector('#hour'),
             desc = document.querySelector('#desc'),
             appointments = document.querySelector('#appointments'),
             appointmentTitle = document.querySelector('#appointment-title');

document.addEventListener('DOMContentLoaded', () => {
    // create the database
    let AppointmentDB = window.indexedDB.open('appointment', 1);

    // if there is an error
    AppointmentDB.onerror = function() {
        console.log('There was an error');
    }
    // if successful, assign the result to the instance
    AppointmentDB.onsuccess = function() {
        // console.log('Database Ready');

        // save the result
        DB = AppointmentDB.result;

        // display the appointments
        displayAppointments();
    }

    // This message runs once (creates schema)
    AppointmentDB.onupgradeneeded = function(e) {
        // the event will be the database
        let db = e.target.result;

        // create an object store
        // keypath is the the indexes for database
        let objectStore = db.createObjectStore('appointments', {keyPath: 'key', autoIncrement: true} );
        // createIndex: 1. field name 2. keypath 3. options
        objectStore.createIndex('artistname', 'artistname', {unique: false} );
        objectStore.createIndex('labelname', 'labelname', {unique: false} );
        objectStore.createIndex('phone', 'phone', {unique: false} );
        objectStore.createIndex('date', 'date', {unique: false} );
        objectStore.createIndex('hour', 'hour', {unique: false} );
        objectStore.createIndex('desc', 'desc', {unique: false} );

        console.log('Database ready and fields created');
    }

    form.addEventListener('submit', addAppointment);

    function addAppointment(e) {
        e.preventDefault();

        // create a new object with the form info
        let newAppointment = {
            artistname : artistName.value,
            labelname : labelName.value,
            phone : phone.value,
            date : date.value,
            hour : hour.value,
            desc : desc.value
        }
        
        // Insert object into the database
        let transaction = DB.transaction(['appointments'], 'readwrite');
        let objectStore = transaction.objectStore('appointments');

        // console.log(objectStore);
        let request = objectStore.add(newAppointment);

        // on success
        request.onsuccess = () => {
            form.reset();
        }
        transaction.oncomplete = () => {
            console.log('New appointment added');

            displayAppointments();
        }
        transaction.onerror = () => {
            console.log('There was an error, try again');
        }
    }

    function displayAppointments() {
        // clear the previous appointments
        while(appointments.firstChild) {
            appointments.removeChild(appointments.firstChild);
        }

        // create the object store
        let objectStore = DB.transaction('appointments').objectStore('appointments');

        objectStore.openCursor().onsuccess = function(e) {
            // assign the current cursor
            let cursor = e.target.result;

            if(cursor) {
                let appointmentHTML = document.createElement('li');
                appointmentHTML.setAttribute('data-appointment-id', cursor.value.key);
                appointmentHTML.classList.add('list-group-item');

                appointmentHTML.innerHTML = `
                    <p class="font-weight-bold">Artist Name: <span class="font-weight-normal">${cursor.value.artistname}</span></p>
                    <p class="font-weight-bold">Label Name: <span class="font-weight-normal">${cursor.value.labelname}</span></p>
                    <p class="font-weight-bold">Phone: <span class="font-weight-normal">${cursor.value.phone}</span></p>
                    <p class="font-weight-bold">Date: <span class="font-weight-normal">${cursor.value.date}</span></p>
                    <p class="font-weight-bold">Time: <span class="font-weight-normal">${cursor.value.hour}</span></p>
                    <p class="font-weight-bold">Work Needed: <span class="font-weight-normal">${cursor.value.desc}</span></p>

                `;

                // Remove button
                const removeBTN = document.createElement('button');
                removeBTN.classList.add('btn', 'btn-danger');
                removeBTN.innerHTML = '<span aria-hidden="true">x</span> Remove';
                removeBTN.onclick = removeAppointment;


                // add into HTML
                appointmentHTML.appendChild(removeBTN);
                appointments.appendChild(appointmentHTML);
                

                cursor.continue();
            } else {
                if(!appointments.firstChild) {
                    appointmentTitle.textContent = 'Add a new session';
                    let noAppointment = document.createElement('p');
                    noAppointment.classList.add('text-center');
                    noAppointment.textContent = 'No results found';
                    appointments.appendChild(noAppointment);
                } else {
                    appointmentTitle.textContent = 'Manage your sessions';
                }
            }
        }
    }

    function removeAppointment(e) {
        let appointmentID = Number(e.target.parentElement.getAttribute('data-appointment-id') );
    }
});