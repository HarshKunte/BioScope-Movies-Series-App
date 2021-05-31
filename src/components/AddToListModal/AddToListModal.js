import React, { useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import firebase from 'firebase'
import Fade from '@material-ui/core/Fade';
import { Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, TextField } from '@material-ui/core';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';
import { StarBorder } from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%'
  },
  paper: {
    width:'50%',
    backgroundColor: theme.palette.background.paper,
    border: "none",
    outline: "none",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth:'70%',
    borderRadius:'30px',
    [theme.breakpoints.down('xs')]: {
      width:'70%',
     },
      
  },
}));

function AddToListModal({addListVisible,user, setAddListVisible, lists, selectedContent, setSelectedContent}) {
 
  const [listInput, setListInput] = useState("")

  const classes = useStyles();


  const handleClose = () => {
    setSelectedContent(null)
    setAddListVisible(false);
  };

  const handleInput = (e) =>{
    setListInput(e.target.value);
  }

  const createList = (e) =>{
    e.preventDefault()
    if(listInput){
      setListInput("")
    db.collection('users').doc(user).collection("lists").add({
      name: listInput,
      items:[]
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
    }
    else{
      toast.error('Enter list name.')
    }
  }

  const addToThisList = (id) =>{
    if(selectedContent){
    db.collection('users').doc(user).collection('lists').doc(id).update({
      items: firebase.firestore.FieldValue.arrayUnion(selectedContent)
    })
    .then(()=>{
      setAddListVisible(false);
      toast.success('Item added to List!!')
    })
  }
  }

  return (
   
     
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={addListVisible}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={addListVisible}>
          <div className={classes.paper}>
            <p id="transition-modal-title" style={{color:'cyan', fontSize:"1rem"}} >Select list to add</p>
           

            <List component="nav"  aria-label="secondary mailbox folders">
                    {
                      lists && lists.map((list,index) =>(
                        <div key={index}>
                        <ListItem  button  >
                            <ListItemIcon>
                              <StarBorder fontSize="small"  />
                            </ListItemIcon>
                        <ListItemText onClick={()=>addToThisList(list.id)} style={{fontWeight:'bolder',color:"white"}} primary={list.name} />
                      </ListItem>
                    <Divider />
                    </div>
                      ))
                    }
                  
                  </List>
            <form noValidate onSubmit={createList}  autoComplete="off" style={{display:'flex',alignItems:'center'}}>

            <TextField color="secondary" id="standard-basic" value={listInput} label="Create New List" onChange={handleInput} />
            <IconButton onClick={createList} style={{marginTop:'15px'}} color="secondary" aria-label="upload picture" component="span">
                <AddCircleTwoToneIcon />
            </IconButton>
            </form>
           </div>

       
       </Fade>
      </Modal>
  
  );
}

export default AddToListModal