import * as firebase from 'firebase'
import * as admin from 'firebase-admin';

import { map } from 'lodash'
require('dotenv').config()

const serviceAccount = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url
}


admin.initializeApp({
  //@ts-ignore
  credential: admin.credential.cert(serviceAccount),
  //@ts-ignore
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
})



const mapSnapshotToEntity = snapshot => ({ id: snapshot.key, ...snapshot.val() })
const mapSnapshotToEntities = snapshot => map(snapshot.val(), (value, id) => ({ id, ...value }))
const ref = path => admin.database().ref(path)
const getValue = path => ref(path).once('value')
const getEntity = path => getValue(path).then(mapSnapshotToEntity)
const getEntities = path => getValue(path).then(mapSnapshotToEntities)

export { mapSnapshotToEntity, mapSnapshotToEntities, ref, getValue, getEntity, getEntities }
