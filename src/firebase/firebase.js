import app from 'firebase';

const config = {
  apiKey: "AIzaSyD-SnimhLWFkYamfKMVN8Si6A6iWd3cBiI",
  authDomain: "ballbox-admin.firebaseapp.com",
  databaseURL: "https://ballbox-admin.firebaseio.com",
  projectId: "ballbox-admin",
  storageBucket: "ballbox-admin.appspot.com",
  messagingSenderId: "200173498648",
  appId: "1:200173498648:web:5d96be435ca888d1"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    /* Helper */

    this.serverValue = app.database.ServerValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIs */

    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();           

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,              
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = uid => this.db.ref(`user/${uid}`);

  users = () => this.db.ref('user');

}

export default Firebase;
