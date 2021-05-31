import "./Header.css";
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app'
import 'firebase/auth'
const Header = ({user}) => {

  var provider = new firebase.auth.GoogleAuthProvider();
  const authWithGoogle = () => {
      firebase.auth().signInWithPopup(provider)
          .then((result) => {
              const user = result.user

          })
          .catch((e) => {
              console.log(e);
              // toast('Something went wrong', { type: 'error' })
          })
  }



  const logOut = (e) => {
    e.preventDefault()
    firebase.auth().signOut().then(() => {

        // toast("Signed out successfully!!", {
        //     type: 'success'
        // })
        // history.push('/')
        console.log('logged out');
    })
}


  return (
    <>
    

    <span onClick={() => window.scroll(0, 0)} className="header">
      🎬 Bioscope 🎥

     {user ? <Button variant="contained" color="primary" style={{marginLeft:'2rem'}} onClick={logOut} >
        Logout
      </Button> :
      <Button variant="contained" color="primary" style={{marginLeft:'2rem'}} onClick={authWithGoogle}  >
        Login
      </Button> 
      
      }
    </span>
    
   
    </>
  );
};

export default Header;
