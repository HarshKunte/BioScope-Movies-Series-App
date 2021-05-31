import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import AddToListModal from "./components/AddToListModal/AddToListModal";
import SimpleBottomNavigation from "./components/MainNav";
import Movies from "./Pages/Movies/Movies";
import Series from "./Pages/Series/Series";
import Trending from "./Pages/Trending/Trending";
import Search from "./Pages/Search/Search";
import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
import MyList from "./Pages/MyList/MyList";
import { useEffect, useState } from "react";
import { app, db } from "./config/firebase";
import toast, { Toaster } from 'react-hot-toast';

const theme = createMuiTheme({
  //  base:'#3f3653'
  palette: {
    type: 'dark',
  },
  });

function App() {

  const [user, setUser] = useState(null)
  const [lists, setLists] = useState(null)
  const [addListVisible, setAddListVisible] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)
  


  useEffect(() => {
    app.auth().onAuthStateChanged(async (user) => {
      if(user){
        setUser(user.uid)
        
      }
      else
      setUser(null)
      console.log(user);
    })
  }, [])

  useEffect( async () => {
   
    if(user){
      const unsub=  await db.collection('users').doc(user).collection('lists').onSnapshot(snap =>{
        const lists  = snap.docs.map(doc =>{
          const data = {id:doc.id, name:doc.data().name, items:doc.data().items}
          return data
        })
       console.log(lists);
        setLists(lists)
       
      })
      return () => {
       unsub()
      }
     
    }
    else{
      setLists([])
    }
    }, [user])

  return (
    <BrowserRouter>
     <ThemeProvider theme={theme}>
      <Header user={user} />
      <div className="app">
        <Container>
          <Switch>
            <Route path="/" exact >
              <Trending setSelectedContent={setSelectedContent} setAddListVisible={setAddListVisible} lists={lists} user={user}/>
            </Route>
            <Route path="/movies" exact >
              <Movies setSelectedContent={setSelectedContent} setAddListVisible={setAddListVisible} lists={lists} user={user}/>
            </Route>
            <Route path="/series" exact >
              <Series setSelectedContent={setSelectedContent} setAddListVisible={setAddListVisible} lists={lists} user={user}/>
            </Route>
            <Route path="/search" exact >
              <Search user={user} setSelectedContent={setSelectedContent} lists={lists} setAddListVisible={setAddListVisible}/>
            </Route>
            <Route path="/mylists" exact >
              <MyList user={user} lists={lists} setAddListVisible={setAddListVisible} />
            </Route>
            
          </Switch>
        </Container>
      </div>
      <AddToListModal user={user} setSelectedContent={setSelectedContent} selectedContent={selectedContent} lists={lists} addListVisible={addListVisible} setAddListVisible={setAddListVisible}/>
      <SimpleBottomNavigation user={user} />
      </ThemeProvider>
      <Toaster 
        position="top-right"
        
        toastOptions={{
          // Define default options
          className: '',
         
          duration: 2000,
          // Default options for specific types
         
        }}
      />
    </BrowserRouter>
  );
}

export default App;
