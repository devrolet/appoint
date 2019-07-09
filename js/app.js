let DB;

const form = document.querySelector('form'),
             artistName = document.querySelector('#artist-name'),
             labelName = document.querySelector('#label-name'),
             phone = document.querySelector('#phone'),
             date = document.querySelector('#date'),
             hour = document.querySelector('#hour'),
             work = document.querySelector('#work'),
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
        let objectStore = db.createObjectStore('apppointments', {keypath: 'key', autoIncrement: true} );
        // createIndex: 1. field name 2. keypath 3. options
        objectStore.createIndex('artistname', 'artistname', {unique: false} );

        console.log('Database ready and fields created');
    }
});