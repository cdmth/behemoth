import * as admin from 'firebase-admin';

import { map, mapKeys } from 'lodash'
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

const mapSnapshotToEntities = snapshot => {
  return map(snapshot.val(), (value, id) => ({ id, ...value }))
}
const ref = path => admin.database().ref(path)
const getValue = path => ref(path).once('value')
const getEntity = (path, id) => ref(path).child(id).once('value').then((res) => res.val())
const getEntities = path => getValue(path).then(mapSnapshotToEntities)
const insertEntity = (path, entity) => ref(path).push(entity)
const updateEntity = (path, id, entity) => ref(path).child(id).update(entity)
const deleteEntity = (path, id) => ref(path).child(id).remove()

export { getEntity, getEntities, insertEntity, updateEntity, deleteEntity }

