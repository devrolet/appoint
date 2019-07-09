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
    }

    // This message runs once (creates schema)
    AppointmentDB.onupgradeneeded = function(e) {
        // the event will be the database
        let db = e.target.result;

        // create an object store
        // keypath is the the indexes for database
        let objectStore = db.createObjectStore('appointments', {keypath: 'key', autoIncrement: true} );
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
        }
        transaction.onerror = () => {
            console.log('There was an error, try again');
        }
    }
});