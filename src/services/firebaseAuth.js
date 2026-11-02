import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { firebaseApp } from './firebaseApp'

export const auth = getAuth(firebaseApp)
export { onAuthStateChanged }

export function loginWithFirebase(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function logoutFromFirebase() {
  return signOut(auth)
}
