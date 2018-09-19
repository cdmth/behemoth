import * as admin from 'firebase-admin';
import { pubsub } from './pubsubber'
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

  // @ts-ignore
  mapKeys(snapshot.val(), (value, key) => {
    entities.push(Object.assign({_id: key}, value))
  })
  
  return entities
}

const ref = (path: string) => admin.database().ref(path)

const getValue = (path: string) => ref(path).once('value')

const getEntity = async (path: string, id: string) => {
  try {
    const getter = await ref(path).child(id).once('value')
    return Object.assign({_id: id}, getter.val())
  } catch (error) {
    console.log(error)
  }
}

const getEntities = (path: string) => {
  try {
    return getValue(path).then(snap => mapSnapshotToEntities(snap))
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

const insertEntity = async (path: string, entity) => {
  try {
    console.log(path, entity)
    const pusher = await ref(path).push(entity)
    const pushed = await pusher.ref.once('value')
    let result = { _id: pushed.ref.path.pieces_[1]}

    console.log(Object.assign(result, pushed.val()))
    return Object.assign(result, pushed.val())
  } catch (error) {
    console.log(error)  
  }
}

const updateEntity = async (path: string, id: string, entity) => {
  await ref(path).child(id).update(entity)
  return getEntity(path, id)
}

const deleteEntity = (path: string, id: string) => ref(path).child(id).remove()

const mapRelationalEntities = (parentId, snapshot, path = '') => {
  let entities = {
    parentId: parentId,
    children: []
  }
  
  let snapshotVal = snapshot.val()
  console.log('snapshotVal', snapshotVal)


  if (snapshotVal) {
    if(path === 'projectWorkers') {
      Object.entries(snapshotVal[Object.keys(snapshotVal)[0]]).map((x) => {
        //  @ts-ignore
        return entities.children.push({workerId: x[0], name: x[1].name})
      })
    } else {
    Object.keys(snapshotVal).forEach(key => {
        entities.children.push(Object.assign({childId: key}, snapshotVal[key]))
      })
    }
  }
  
  return entities
}

const getRelationalEntities =  async (path: string, parentId: string) => {
  const entities = await ref(path).once('value')
    .then(snapshot => mapRelationalEntities(parentId, snapshot, path))
  return entities
}

const setChildEntity = async (path: string, parentId: string, childId: string, entity) => {
  try {
    const pathToParent = path + '/' + parentId
    await ref(pathToParent).child(childId).set(entity)
    return ref(pathToParent).once('value')
      .then(snapshot => mapRelationalEntities(parentId, snapshot))
  } catch (error) {
    console.log(error)
  }
}

const getChildEntities = async (path:string) => {
  try {
    const entities = await ref(path).once('value').then(snapshot => mapSnapshotToEntities(snapshot))
    return entities
  } catch (error) {
    console.log(error)
  }
}

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
  insertEntity, 
  updateEntity, 
  deleteEntity, 
  getEntitiesByValue,
  setChildEntity,
  getChildEntities,
  getRelationalEntities
}