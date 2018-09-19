import * as admin from 'firebase-admin';
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

  console.log(snapshot.val())

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

const peformMultiPathUpdates = async (snapshot) => {
  let updateObject = {}

  const snapshotVal = snapshot.val()
  const changedTable = snapshot.ref.path.pieces_[0]
  const changedChildId = snapshot.ref.path.pieces_[1]

  if (changedTable === 'workers') {
    console.log('update worker relations')

    // update path for projectWorkers 
    let updatePath
    let root = 'projectWorkers'

    // @ts-ignore
    await getValue('projectWorkers').then(pwSnap => {
      // @ts-ignore
      pwSnap.forEach(pSnap => {
        const workerIdsOfProject = Object.keys(pSnap.val())
        workerIdsOfProject.forEach(key => {
          if (key === changedChildId) {
            updatePath = `${root}/${pSnap.key}/${changedChildId}`
            const changedParentFieldKeys = Object.keys(snapshotVal)
            changedParentFieldKeys.forEach(changedParentField => {
              updateObject[`${updatePath}/${changedParentField}`] = snapshotVal[changedParentField]
            })
          }
        })
      })
    })
    console.log('multiupdating with updateObject', updateObject)
    admin.database().ref().update(updateObject)
  }
}

const performMultiPathInsert = (snapshot) => {
  const snapshotVal = snapshot.val()
  const changedTable = snapshot.ref.path.pieces_[0]

  if (changedTable === 'entries') {
    let root = 'workerProjectEntries'
    
    const entryId = snapshot.key
    const { workerId, projectId, ...rest} = snapshotVal
    
    let insertPath = `${root}/${workerId}/${projectId}/${entryId}`
    ref(insertPath).set(rest)
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
  listener.on("child_changed", snapshot => {
    peformMultiPathUpdates(snapshot)
  })
  listener.on("child_added", snapshot => {
    performMultiPathInsert(snapshot)
  })
}

createListenerWorker("workers")
createListenerWorker("projectWorkers")
createListenerWorker("customers")
createListenerWorker("projects")
createListenerWorker("entries")

export { 
  getEntity,
  getEntities, 
  pushEntity, 
  setEntity,
  updateEntity, 
  deleteEntity, 
  getEntitiesByValue
}