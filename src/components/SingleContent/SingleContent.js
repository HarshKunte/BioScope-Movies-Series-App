import { Badge, Chip } from "@material-ui/core";
import { img_300, unavailable } from "../../config/config";
import "./SingleContent.css";
import ContentModal from "../ContentModal/ContentModal";
import toast, { Toaster } from 'react-hot-toast';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import firebase from 'firebase'
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
const SingleContent = ({
  id,
  poster,
  title,
  date,
  media_type,
  vote_average,
  setSelectedContent,
  setAddListVisible,
  lists,
  inList,
  user,
  noaddToList,
  addedInListId
}) => {

  // useEffect(() => {
  //  checkAlreadyAdded()
  // }, [])

  const addToList = (e) =>{
    e.stopPropagation()
    if(user){
    setSelectedContent({id,poster,title,date,media_type,vote_average})
    setAddListVisible(true)
    }
    else{
      toast.error('You need to login to make a List.')
    }
  }

 const removeItemFromList = (e,id) =>{
   e.stopPropagation()
   if(window.confirm('Do you want to remove this from list?')){
   db.collection('users').doc(user).collection('lists').doc(addedInListId).update({
     items: firebase.firestore.FieldValue.arrayRemove({id,poster,title,date,media_type,vote_average})
   })
   .then(()=>{
     toast.success('Item removed from list')
   })
   .catch(()=> toast.error('Some error occures'))
 }
}

  
 
  return (
    <ContentModal media_type={media_type} id={id}>
      <Badge
        badgeContent={vote_average}
        color={vote_average > 6 ? "primary" : "secondary"}
      />

      {noaddToList && <CancelRoundedIcon onClick={(e)=>removeItemFromList(e,id)} color="inherit" style={{marginBottom:'2px'}} />}
      <img
        className="poster"
        src={poster ? `${img_300}${poster}` : unavailable}
        alt={title}
      />
      <b className="title">{title}</b>
      <span className="subTitle">
        {media_type === "tv" ? "TV Series" : "Movie"}
        <span className="subTitle">{date}</span>
      </span>
      {
       !noaddToList &&( inList ? (
          <span>
          
  
          <Chip size="small" style={{maxWidth:'100%'}}
        label={"Added to "+inList.name}
        color="secondary"
       
      />
          
        </span>
        ) : (
          <span>
          <p onClick={addToList}>
  
          Add to List
          </p>
        </span>
        )
       )
      }
     
    </ContentModal>
  );
};

export default SingleContent;
