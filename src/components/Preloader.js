import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { opacity, slideUp } from "./anim"; // Ensure you create the animation file

const words = [
    "Hello",        // English
    "வணக்கம்",    // Tamil
    "नमः",         // Sanskrit
    "Bonjour",      // French
    "Ciao",         // Italian
    "やあ",         // Japanese
    "Hallå",        // Swedish
    "Hallo",        // Dutch
    "नमस्ते",      // Hindi
    "నమస్కారం",   // Telugu
    "നമസ്കാരം"  , // Malayalam
    "Guten tag",    // German
    "Hola",         // Spanish
  ];
  
export default function Preloader() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index === words.length - 1) return;
        const timeout = setTimeout(() => {
            setIndex(index + 1);
        }, index === 0 ? 1000 : 150);
        return () => clearTimeout(timeout);
    }, [index]);

    return (
        <motion.div className="preloader" initial="initial" animate="open" exit="closed">
            <motion.div variants={opacity}>
                <motion.h1 variants={slideUp}>{words[index]}</motion.h1>
            </motion.div>
        </motion.div>
    );
}
