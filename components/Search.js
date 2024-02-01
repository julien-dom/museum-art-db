import styles from "../styles/Search.module.css";
import { useEffect, useState } from "react";
import Head from "next/head";
import Artwork from "./Artwork";

function Search() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [resultsData, setResultsData] = useState([]);

  const handleSubmit = () => {
    setResultsData([]);
    fetch(
      `https://api.harvardartmuseums.org/object?apikey=586ec4d2-e357-4678-8534-776ebec91e99&size=200&hasimage=1&q=${searchKeyword}`
    )
      .then((response) => response.json())
      .then((data) => {
        const formatedData = data.records
          .filter((artwork) => artwork.images && artwork.images.length > 0) // Ne garder que oeuvres qui ont une url d'images jpg dispos
          .filter((artwork) =>
            artwork.title.toLowerCase().includes(searchKeyword.toLowerCase())
          ) // rechercher si le mot est dans le titre
          .map((artwork) => {
            // images de l'API très lourdes, on les reduit avec height et width cf doc
            let image = artwork.images[0].baseimageurl;
            image = `${image}?height=500&width=500`;
            let author =
              artwork.people && artwork.people.length > 0
                ? artwork.people[0]?.name
                : "Unknown"; // Check if people array exists and has elements
            let title = artwork.title;
            let museum = "Harvard Museums Collection";
            return {
              image,
              author,
              title,
              museum,
            };
          });
        console.log(formatedData);
        // ajouter donner au tableau existant
        setResultsData((prevData) => [...prevData, ...formatedData]);
      });

    fetch(
      `https://api.artic.edu/api/v1/artworks/search?limit=100&fields=id,title,image_id, department_title, date_display, artist_display, description, artist_titles, term_titles&q=${searchKeyword}`
    )
      .then((response) => response.json())
      .then((data) => {
        const formatedData = data.data
          .filter((artwork) =>
            artwork.title.toLowerCase().includes(searchKeyword.toLowerCase())
          ) // rechercher si le mot est dans le titre
          .map((artwork) => {
            let image = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
            let author = artwork.artist_titles;
            let title = artwork.title;
            let museum = "Art Institute of Chicago Collection";

            return {
              image,
              author,
              title,
              museum,
            };
          });
        setResultsData((prevData) => [...prevData, ...formatedData]);
      });
  };

  const results = resultsData.map((data, i) => {
    let formattedAuthor = data.author;
    if (formattedAuthor.length > 30) {
      formattedAuthor = formattedAuthor.substring(0, 30) + "...";
    }
    return <Artwork key={i} {...data} />;
  });

  return (
    <div>
      <Head>
        <title>LGBTQIA+ Art</title>
      </Head>
      <div>
        <input
          onChange={(e) => setSearchKeyword(e.target.value)}
          value={searchKeyword}
          placeholder="Search in the title..."
        />
        <button onClick={() => handleSubmit()}>Search</button>
      </div>
      <div className={styles.artworksContainer}>{results}</div>
    </div>
  );
}

export default Search;
