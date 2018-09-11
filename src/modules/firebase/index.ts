import * as firebase from 'firebase'

import { map } from 'lodash'

import constants from '../../../config/constants'

firebase.initializeApp({
    apiKey: constants.apiKey,
    authDomain: constants.authDomain,
    databaseURL: constants.databaseURL,
    projectId: constants.projectId,
    storageBucket: constants.storageBucket,
    messagingSenderId: constants.messagingSenderId
})

const mapSnapshotToEntity = snapshot => ({ id: snapshot.key, ...snapshot.val() })
const mapSnapshotToEntities = snapshot => map(snapshot.val(), (value, id) => ({ id, ...value }))
const ref = path => firebase.database().ref(path)
const getValue = path => ref(path).once('value')
const getEntity = path => getValue(path).then(mapSnapshotToEntity)
const getEntities = path => getValue(path).then(mapSnapshotToEntities)

export { mapSnapshotToEntity, mapSnapshotToEntities, ref, getValue, getEntity, getEntities }
