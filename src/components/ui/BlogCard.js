import Link from "next/link";
import styles from "./BlogCard.module.scss";
import AnimatedButton from "../AnimatedButton";
export function BlogCard({ image, title, description, date, url }) {
  return (
    <div className={styles.blogCardContainer}>
      <div className={styles.card}>
        <h2>{title}</h2>
        <div className={styles.body}>
          <div className={styles.description}>
            <p>{description}</p>
            <span>{date}</span>
            <span>
            <Link href={url} passHref>
                <AnimatedButton className={styles.animatedButton} flash={false}>
                  <span className="rounded-full" />
                  <text>View Blog</text>
                </AnimatedButton>
              </Link>
            </span>
          </div>
          <div className={styles.imageContainer}>
            <img src={image} alt={title} />
          </div>
        </div>
      </div>
    </div>
  );
}
