import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Head from "next/head";
import Artwork from "./Artwork";

function Home() {
  const [artworksData, setArtworksData] = useState([]);

  // //Fetch API musée Chicago
  useEffect(() => {
    fetch(
      "https://api.artic.edu/api/v1/artworks/search?query[term][department_id]=PC-12&limit=100&fields=id,title,image_id, department_title, date_display, artist_display, description, artist_titles, term_titles"
    )
    .then((response) => response.json())
    .then((data) => {
      const formatedData = data.data.map((artwork) => {
        let image = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
        let author = artwork.artist_titles;
        let title = artwork.title;

        return {
          image,
          author,
          title,
        };
      });
      setArtworksData(formatedData);
    });
  }, []);

  //Fecth API musée Cleveland
  // useEffect(() => {
  //   fetch(
  //     "https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&department=Photography&limit=100"
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const formatedData = data.data.map((artwork) => {
  //         // Check if creators array exists and has elements
  //         let author =
  //           artwork.creators && artwork.creators.length > 0
  //             ? artwork.creators[0].description
  //             : "Unknown";
  //         let date = artwork.creation_date;
  //         let title = artwork.title;
  //         let image = artwork.images.web.url;
  //         let technique = artwork.technique;
  //         let type = artwork.type;
  //         let description = artwork.wall_description;
  //         let funFact = artwork.fun_fact;
  //         let department = artwork.department;
  //         return {
  //           author,
  //           date,
  //           title,
  //           image,
  //           technique,
  //           type,
  //           description,
  //           funFact,
  //           department,
  //         };
  //       });
  //       setArtworksData((prevData) => [...prevData, ...formatedData]);
  //     });
  // }, []);

  // Fetch HARVARD (modifier et faire backend pour apikey)
  useEffect(() => {
    fetch(
      "https://api.harvardartmuseums.org/object?hasimage=1&classification=Photographs&group=2039923&apikey=586ec4d2-e357-4678-8534-776ebec91e99&size=100"
      )
      .then((response) => response.json())
      .then((data) => {
        const formatedData = data.records
          .filter((artwork) => artwork.images && artwork.images.length > 0) // Ne garder que oeuvres qui ont une url d'images jpg dispos
          .map((artwork) => {
            // images de l'API très lourdes, on les reduit avec height et width cf doc
            let image = artwork.images[0].baseimageurl;
            image = `${image}?height=500&width=500`;
            let author = artwork.people[0].name;
            let title = artwork.title;
            return {
              image,
              author,
              title,
            };
          });
          console.log(formatedData)
        // ajouter donner au tableau existant
        setArtworksData((prevData) => [...prevData, ...formatedData]);
      });
  }, []);

  const artworks = artworksData.map((data, i) => {
    let formattedAuthor = data.author;
    if (formattedAuthor.length > 30) {
      formattedAuthor = formattedAuthor.substring(0, 30) + "...";
    }
    return <Artwork key={i} {...data} />;
  });

  // console.log('console log artworkData is', artworksData)
  return (
    <div>
      <Head>
        <title>LGBTQIA+ Art</title>
      </Head>
      <div className={styles.artworksContainer}>{artworks}</div>
    </div>
  );
}

export default Home;
