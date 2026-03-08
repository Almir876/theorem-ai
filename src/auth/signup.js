import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { createOrMergeUserProgress } from "../services/progressService";

export async function signupWithEmail(email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await createOrMergeUserProgress(credential.user.uid);
  return credential.user;
}
