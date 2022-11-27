import {
  getFirestore,
  addDoc,
  collection,
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

import app from './fireConfig.js';
import { btnsWrapper, form } from './domElement.js';
import defindActivity from './activities.js';
import formController from './form.js';
import graphController from './graph.js';

const db = getFirestore(app);
const dbName = 'activities';

let activity = 'cycling';

btnsWrapper.addEventListener('click', event => {
  activity = defindActivity(event);
  graphController(data, activity);
});

form.addEventListener('submit', event => {
  formController(event, activity, async data => {
    await addDoc(collection(db, dbName), data);
  });
});

let data = [];
onSnapshot(collection(db, dbName), doc => {
  doc.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      case 'modified':
        data = data.map(item => (item.id === doc.id ? doc : item));
        break;
      default:
        break;
    }
  });

  graphController(data, activity);
});

// function addDummy(activity, n) {
//   let today = new Date();
//   let currDate = today.getDate();
//   let date = currDate - n;
//   let month = today.getMonth();
//   let year = today.getFullYear();
//   for (; date <= currDate; date++) {
//     addDoc(collection(db, dbName), {
//       distance: Math.round(Math.random() * 10 + 1) * 1000,
//       activity,
//       date: new Date(year, month, date, 9).toString(),
//     });
//   }
// }

// // add 15 new entries for the 'Running'
// addDummy('walking', 8);
