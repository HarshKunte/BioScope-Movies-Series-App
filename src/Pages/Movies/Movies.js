import axios from "axios";
import { useEffect, useState } from "react";
import Genres from "../../components/Genres/Genres";
import SingleContent from "../../components/SingleContent/SingleContent";
import useGenre from "../../hooks/useGenre";
import CustomPagination from "../../components/Pagination/CustomPagination";
import { CircularProgress } from "@material-ui/core";

const Movies = ({setSelectedContent,setAddListVisible,user, lists}) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const genreforURL = useGenre(selectedGenres);
  const [isLoading, setIsLoading] = useState(true)
  // console.log(selectedGenres);

  const fetchMovies = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreforURL}`
    );
    setIsLoading(false)
   
    setContent(data.results);
    setNumOfPages(data.total_pages);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchMovies();
    // eslint-disable-next-line
  }, [genreforURL, page]);

  const isAddedToList = (id) =>{
  
    let inList= null
   lists.some(list => {

    
    let arr = list.items.filter(item =>{
      return item.id === id
    });

      if(arr.length >0 ) inList = list;
      return arr.length>0

      // return inList.length>0
    
   
   });

   return inList
  }

  if(isLoading){
    return (
      <div style={{width:'100%',height:'100%',display:'flex', justifyContent:'center'}}>

      <CircularProgress style={{marginTop:'4rem'}} color="secondary" />
      </div>
    )
  }

  return (
    <div>
      <span className="pageTitle">Discover Movies</span>
      <Genres
        type="movie"
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
        setPage={setPage}
      />
      <div className="trending">
        {content &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type="movie"
              vote_average={c.vote_average}
              setSelectedContent={setSelectedContent}
              setAddListVisible={setAddListVisible}
              user={user}
              lists={lists}
              inList ={isAddedToList(c.id)}
            />
          ))}
      </div>
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
    </div>
  );
};

export default Movies;
