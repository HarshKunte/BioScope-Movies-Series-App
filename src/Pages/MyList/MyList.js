import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import { Button, Chip, createMuiTheme, ThemeProvider } from '@material-ui/core';
import {  db } from '../../config/firebase'
import SingleContent from '../../components/SingleContent/SingleContent';
import toast from 'react-hot-toast';

const theme = createMuiTheme({
    //  base:'#3f3653'
    palette: {
      type: 'dark',
    },
    });

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },

    container:{
      backgroundColor:'#697175', 
      flexWrap:'wrap',
      [theme.breakpoints.down('xs')]:{
        justifyContent:'space-evenly'
      }
    }
  }));

  


function MyList({lists, user, setAddListVisible}) {
    const classes = useStyles();

    const isAddedToList = (id) =>{
  
      let inList= null
     lists.some(list => {
  
       console.log("loop");
      let arr = list.items.filter(item =>{
        return item.id === id
      });
  
        if(arr.length >0 ) inList = list;
        return arr.length>0      
     
     });
    }

    const deleteList = (id) =>{
      if(window.confirm('Do you want to delete this list??')){

        db.collection("users").doc(user).collection('lists').doc(id).delete()
        .then(()=>{
          toast.success('List deleted.')
        })
        .catch(()=> toast.error('Some error occurred'))

      }
    }

    return (
      <>
       { user ? (<ThemeProvider theme={theme}>
           <span className="pageTitle">My List</span>
        <div>
       { lists.length>0 ?( lists.map(list => (
          <Accordion key={list.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{backgroundColor:'#555d61'}}
                >
                  <Typography className={classes.heading}>{list.name}</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.container}  >

                  <div style={{width:'100%',height:'3rem'}}>
                  <Chip onClick={()=> deleteList(list.id)} size="small" label="Delete this list" clickable  color="primary" style={{backgroundColor:'#90caf9',color:'black'}}  />

                  </div>
                
                  {list.items.map(c => (
                  <SingleContent
                    key={c.id}
                    id={c.id}
                    poster={c.poster}
                    title={c.title || c.name}
                    date={c.date}
                    media_type={c.media_type}
                    vote_average={c.vote_average}
                    user={user}
                    lists={lists}
                    inList ={isAddedToList(c.id)}
                    noaddToList
                    addedInListId = {list.id}
                  /> ))}
                </AccordionDetails>
          </Accordion>
       ))
       ) :
       (
         <div style={{width:'100%', textAlign:'center'}}>

         <h3>
           You dont have any lists.
         </h3>
         <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={()=> setAddListVisible(true)}
              style={{marginTop:'10px'}}
      >
        Create new list
      </Button>
         </div>
       )
    
    }
      
        </div>
        </ThemeProvider>) :
        (
          <div style={{width:'100%', textAlign:'center'}}>
            <h2>You need to login to view this page!</h2>
           
          </div>
        )
      }
      </>
    )
}

export default MyList
