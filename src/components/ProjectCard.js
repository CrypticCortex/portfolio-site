'use client';
import { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CardContent } from "@/components/ui/CardContent";
import AnimatedButton from "./AnimatedButton";
import styles from './style.module.scss';

export default function ProjectCard({ title, description, image, url, scrollYProgress, range, targetScale, index }) {
  const container = useRef(null);
  const scale = useTransform(scrollYProgress, range, [1, targetScale]);

  return (
    <div ref={container} className={styles.cardContainer}>
      <motion.div 
        className={`transform transition-transform duration-300 shadow-lg ${styles.card}`}
        style={{ scale }}
      >
        <Card>
          <img src={image} alt={title} className={styles.cardImage} />
          <CardContent className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDescription}>{description}</p>
            <div className={styles.buttonContainer}>
              <Link href={url} passHref>
                <AnimatedButton className={styles.animatedButton} flash={false}>
                  <span className="rounded-full" />
                  <text>View Project</text>
                </AnimatedButton>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
