import styles from "../styles/Search.module.css";
import { useEffect, useState } from "react";
import Head from "next/head";
import Artwork from "./Artwork";

function Search() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [resultsData, setResultsData] = useState([]);

  const handleSubmit = () => {
    fetch(
      `https://api.harvardartmuseums.org/object?apikey=586ec4d2-e357-4678-8534-776ebec91e99&size=200&hasimage=1&q=${searchKeyword}`
    )
      .then((response) => response.json())
      .then((data) => {
        const formatedData = data.records
          .filter((artwork) => artwork.images && artwork.images.length > 0) // Ne garder que oeuvres qui ont une url d'images jpg dispos
          .filter((artwork) => artwork.title.toLowerCase().includes(searchKeyword.toLowerCase())) // rechercher si le mot est dans le titre
          .map((artwork) => {
            // images de l'API très lourdes, on les reduit avec height et width cf doc
            let image = artwork.images[0].baseimageurl;
            image = `${image}?height=500&width=500`;
            let author =
              artwork.people && artwork.people.length > 0
                ? artwork.people[0]?.name
                : "Unknown"; // Check if people array exists and has elements
            let title = artwork.title;
            return {
              image,
              author,
              title,
            };
          });
        console.log(formatedData);
        // ajouter donner au tableau existant
        setResultsData(formatedData);
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
