import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from "./components/AddMovie";


function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMoviesHandler = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const loadedMovies = [];

        // const response = await fetch('https://swapi.dev/api/films/');
        axios.get('https://u-react-http-default-rtdb.firebaseio.com/movies.json')
            .then(function (response) {
                for (const key in response.data) {
                    loadedMovies.push({
                        id: key,
                        title: response.data[key].title,
                        openingText: response.data[key].openingText,
                        releaseDate: response.data[key].releaseDate
                    })
                }

                setMovies(loadedMovies);
            })
            .catch(function (httpError) {
                setError(httpError.message);
            });

        setIsLoading(false);
    }, []);

    function addMovieHandler(movie) {
        axios.post('https://u-react-http-default-rtdb.firebaseio.com/movies.json', {
            title: movie.title,
            openingText: movie.openingText,
            releaseDate: movie.releaseDate
        }).then(function (response) {
            console.log(response);
        }).catch(function (httpError) {
            console.log(httpError);
        });

    }

    let content = <p>Found no movies.</p>;

    if (movies.length > 0) {
        content = <MoviesList movies={movies}/>;
    }

    if (error) {
        content = <p>{error}</p>;
    }
    if (isLoading) {
        content = <p>Loading...</p>;
    }

    useEffect(() => {
        fetchMoviesHandler();
    }, [fetchMoviesHandler]);

    return (
        <React.Fragment>
            <section>
                <AddMovie onAddMovie={addMovieHandler}/>
            </section>
            <section>
                <button onClick={fetchMoviesHandler}>Fetch Movies</button>
            </section>
            <section>
                {content}
            </section>
        </React.Fragment>
    );
}

export default App;
