import * as admin from 'firebase-admin';

import { mapKeys } from 'lodash'
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
  let entities = []

  mapKeys(snapshot.val(), (value, key) => { 
    value._id = key
    entities.push(value)
    return key + value
  })

  return entities
}

const ref = (path: string) => admin.database().ref(path)
const getValue = (path: string) => ref(path).once('value')

const getEntity = async (path: string, id: string) => {
  try {
    const getter = await ref(path).child(id).once('value')
    return getter.val()
  } catch (error) {
    console.log("something went wrong")
  }
}

const getEntities = (path: string) => {
  try {
    return getValue(path).then(mapSnapshotToEntities)
  } catch (error) {
    console.log(error)
  }
}

const insertEntity = async (path: string, entity) => {
  try {
    const pusher = await ref(path).push(entity)
    const pushed = await pusher.ref.once('value')
    return pushed.val()
  } catch (error) {
    console.log(error)
  }
}

const insertEntityToParent = (path: string, entity) => ref(path).parent.push(entity)

const updateEntity = async (path: string, id: string, entity) => {
  await ref(path).child(id).update(entity)
  return getEntity(path, id)
}
const deleteEntity = (path: string, id: string) => ref(path).child(id).remove()

export { getEntity, getEntities, insertEntity, updateEntity, deleteEntity, insertEntityToParent }

