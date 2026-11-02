import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { firebaseApp } from './firebaseApp'

const db = getFirestore(firebaseApp)

export { collection, doc, onSnapshot, orderBy, query }

export function subscribeToFeaturedProjects(onChange, onError) {
  return onSnapshot(doc(db, 'settings', 'portfolio'), (settingsDocument) => {
    onChange(settingsDocument.exists()
      ? settingsDocument.data().featuredProjectIds || []
      : [])
  }, onError)
}

export function subscribeToMessages(onChange, onError) {
  const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
  return onSnapshot(messagesQuery, (snapshot) => {
    onChange(snapshot.docs.map((messageDocument) => {
      const message = messageDocument.data()
      const createdAt = message.createdAt?.toDate?.().toISOString() || new Date().toISOString()
      return { ...message, id: messageDocument.id, createdAt }
    }))
  }, onError)
}

export function saveFeaturedProjects(projectIds) {
  return setDoc(doc(db, 'settings', 'portfolio'), { featuredProjectIds: projectIds })
}

export function setMessageAnswered(messageId, answered) {
  return updateDoc(doc(db, 'messages', messageId), { answered })
}
