import * as admin from 'firebase-admin'
import * as firebase from 'firebase'
import { pubsub } from './pubsubber'

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

firebase.initializeApp({
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

const ref = (path: string) => admin.database().ref(path)

const getValue = (path: string) => ref(path).once('value')

const getEntity = async (path: string, id: string) => {
  try {
    const snapshot = await ref(path).child(id).once('value')
    return Object.assign({_id: id}, snapshot.val())
  } catch (error) {
    console.log(error)
  }
}

const mapSnapshotToEntities = snapshot => {
  let entities = []

  if (snapshot.val()) {
    Object.keys(snapshot.val()).forEach(key => {
      entities.push(Object.assign({_id: key}, snapshot.val()[key]))
    })
  }

  return entities
}


const getEntities = (path: string) => {
  try {
    return getValue(path).then(snapshot => mapSnapshotToEntities(snapshot))
  } catch (error) {
    console.log(error)
  }
}

const getEntitiesByValue = (path: string, key: string, value: string) => {
  try {
    return ref(path).orderByChild(key).equalTo(value).once('value').then(snapshot => mapSnapshotToEntities(snapshot))
  } catch (error) {
    console.log(error)
  }
}

const getRelations = async (path: string) => {
  try {
    const relations = []

    const snapshot = await ref(path).once('value')
    const value = snapshot.val()
  
    if (value) {
      Object.keys(value).forEach(key => {
        relations.push(Object.assign({_id: key}, value[key]))
      })
    }
    
    return relations
  } catch (error) {
    console.log(error)
  }
}

/**
 * retrieves entities between given start and end values.
 * 
 * startKey - field name for the start in firebase
 * startValue - start of the range
 * endKey - field name for the end in firebase
 * endValue - end of the range
 * options - pass in objects that contain key and value (ex. check field matches with request)
 */
const getEntitiesByValueAndTimeRange = async (path: string, startKey: string, startValue: string, endKey: string, endValue: string, ...options) => {
  try {
    let entities = []
    
    await ref(path).orderByChild(endKey).startAt(startValue).endAt(endValue).once('value').then(snapshot => {
      // @ts-ignore
      snapshot.forEach(child => {
        let val = child.val()
        let key = child.key
        // val[startKey] gets the start-value of the looked after entity (ex. entry start)
        // compare the start value that it is after the query parameter startValue.
        if (startValue <= val[startKey]) {
          try {
            options.forEach(option => {
              const optionKey = Object.keys(option)[0]
              const optionValue = Object.values(option)[0]
              if (val[optionKey] !== optionValue) {
                throw new Error('options are not passing')
              }
              const entity = Object.assign({_id: key}, val)
              entities.push(entity)
            })
          } catch (error) {
            // nothing to see here
          }
        }
      })
    })

    return entities
  } catch (error) {
    console.log(error)
  }
}

const pushEntity = async (path: string, entity) => {
  try {
    const pusher = await ref(path).push(entity)
    const pushed = await pusher.ref.once('value')
    let result = { _id: pushed.ref.path.pieces_[1]}
    return Object.assign(result, pushed.val())
  } catch (error) {
    console.log(error)  
  }
}

const setEntity = async (path: string, entity) => {
  try {
    await ref(path).set(entity)
    const newData = await ref(path).once('value')
    let result = { _id: newData.key}
    return Object.assign(result, newData.val())
  } catch (error) {
    console.log(error)
  }
}

const updateEntity = async (path: string, id: string, entity) => {
  await ref(path).child(id).update(entity)
  return getEntity(path, id)
}

const deleteEntity = (path: string, id: string) => ref(path).child(id).remove()

const updateMultiPathEntity = async (entity) => {
  try {
    admin.database().ref().update(entity)
  } catch (error) {
    console.log(error)
  }
}

const createAccount = async (args) => {
  const { email, password } = args
  try {
    const userCredentials = await firebase.auth().createUserWithEmailAndPassword(email, password)
    const token = await userCredentials.user.getIdToken()
    return {token}
  } catch(error) {
    console.log('oops', error)
  }
} 

const login = async (args) => {
  const { email, password } = args
  try {
    const userCredentials = await firebase.auth().signInWithEmailAndPassword(email, password)
    const token = await userCredentials.user.getIdToken()
    return {token}
  } catch(error) {
    console.log('oops', error)
  }
}

const createListenerWorker = (path:string) => {
  const listener = ref(path + '/')
  listener.on("value", async function(snapshot) {
    let subscribeObject = {}
    let entities = mapSnapshotToEntities(snapshot)
    subscribeObject[path] = entities
    pubsub.publish(path, subscribeObject)
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  })
}

createListenerWorker("workers")
createListenerWorker("projectWorkers")
createListenerWorker("customers")
createListenerWorker("projects")
createListenerWorker("entries")

require('events').EventEmitter.prototype._maxListeners = 100;

export { 
  getEntity,
  getEntities, 
  pushEntity, 
  setEntity,
  updateEntity, 
  deleteEntity, 
  getEntitiesByValue,
  getEntitiesByValueAndTimeRange,
  updateMultiPathEntity,
  getRelations,
  createAccount,
  login
}