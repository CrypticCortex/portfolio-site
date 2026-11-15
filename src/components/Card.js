import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from '../styles/Card.module.scss';
import AnimatedButton from './AnimatedButton';

const Card = ({ title, description, image, url, color }) => (
  <motion.div className={styles.card} style={{ backgroundColor: color }}>
    <h2>{title}</h2>
    <p>{description}</p>
    <motion.div className={styles.imageContainer}>
      <Image src={image} alt={title} layout="fill" objectFit="cover" />
    </motion.div>
    <a href={url} target="_blank" rel="noopener noreferrer">
      <AnimatedButton flash={false}>
        <span className="rounded-full"></span>
        <text>View Project</text>
      </AnimatedButton>
    </a>
  </motion.div>
);

export default Card;
