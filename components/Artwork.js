import styles from "../styles/Artwork.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";

function Artwork(props) {
  // raccourcir longs titres
  let title = props.title;
  if (title.length > 30) {
    title = title.substring(0, 30) + "...";
  }
  return (
    <div className={styles.artworkContainer}>
      <div className={styles.imageContainer}>
        <Image src={props.image} objectFit="contain" layout="fill" />
      </div>
      <div className={styles.author}>{props.author}</div>
      <div className={styles.title}>{title}</div>
    </div>
  );
}

export default Artwork;
