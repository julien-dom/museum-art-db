import styles from "../styles/Search.module.css";
import { useEffect, useState } from "react";
import Head from "next/head";
import Artwork from "./Artwork";

function Search() {
  const customArtworkStyles = {
    author: styles.customAuthor,
    title: styles.customTitle,
    museum: styles.customMuseum,
  };

  const [searchKeyword, setSearchKeyword] = useState("");
  const [resultsData, setResultsData] = useState([]);
  
  // handle subit qui se declenche lorsque je clique bouton search (ça cherche dans mes API)
  const handleSubmit = async () => {
    try {
      setResultsData([]);
  
      // Harvard Art Museums API
      const harvardResponse = await fetch(
        `https://api.harvardartmuseums.org/object?apikey=586ec4d2-e357-4678-8534-776ebec91e99&size=200&hasimage=1&q=${searchKeyword}`
      );
      const harvardData = await harvardResponse.json();
      const harvardFormattedData = harvardData.records
        .filter((artwork) => artwork.images && artwork.images.length > 0)
        .filter((artwork) =>
          artwork.title.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        .map((artwork) => {
          let image = artwork.images[0].baseimageurl;
          image = `${image}?height=500&width=500`;
          let author =
            artwork.people && artwork.people.length > 0
              ? artwork.people[0]?.name
              : "Unknown";
          let title = artwork.title;
          let museum = "Harvard Museums Collection";
          return {
            image,
            author,
            title,
            museum,
          };
        });
      setResultsData((prevData) => [...prevData, ...harvardFormattedData]);
  
      // Art Institute of Chicago API
      const chicagoResponse = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?limit=100&fields=id,title,image_id, department_title, date_display, artist_display, description, artist_titles, term_titles&q=${searchKeyword}`
      );
      const chicagoData = await chicagoResponse.json();
      const chicagoFormattedData = chicagoData.data
        .filter((artwork) =>
          artwork.title.toLowerCase().includes(searchKeyword.toLowerCase())
        )
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
      setResultsData((prevData) => [...prevData, ...chicagoFormattedData]);
  
      // Cleveland Museum of Art API
      const clevelandResponse = await fetch(
        `https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&limit=100&q=${searchKeyword}`
      );
      const clevelandData = await clevelandResponse.json();
      const clevelandFormattedData = clevelandData.data
        .filter((artwork) =>
          artwork.title.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        .map((artwork) => {
          let author =
            artwork.creators && artwork.creators.length > 0
              ? artwork.creators[0].description
              : "Unknown";
          let date = artwork.creation_date;
          let title = artwork.title;
          let image = artwork.images.web.url;
          let museum = "The Cleveland Museum of Art";
          return {
            author,
            date,
            title,
            image,
            museum,
          };
        });
      setResultsData((prevData) => [...prevData, ...clevelandFormattedData]);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log("resultsdata is", resultsData);

  const results = resultsData.map((data, i) => {
    let formattedAuthor = data.author;
    if (formattedAuthor.length > 40) {
      formattedAuthor = formattedAuthor.substring(0, 40) + "...";
    }

    let formattedTitle = data.title
    if (formattedTitle.length > 40) {
      formattedTitle = formattedTitle.substring(0, 40) + "...";
    }
    return <Artwork key={i} {...data} customStyles={customArtworkStyles} author={formattedAuthor} title={formattedTitle}/>;
  });

  return (
    <div>
      <Head>
        <title>Museum Images Database</title>
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
