import styles from "../styles/Artwork.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";

function Artwork(props) {

  return (
    <div className={styles.artworkContainer}>
      <div className={styles.imageContainer}>
        <Image src={props.image} objectFit="contain" layout="fill" />
      </div>
      <div className={props.customStyles.author}>{props.author}</div>
      <div className={props.customStyles.title}>{props.title}</div>
      <div className={props.customStyles.museum}>{props.museum}</div>

    </div>
  );
}

export default Artwork;
