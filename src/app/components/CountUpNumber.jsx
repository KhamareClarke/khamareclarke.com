import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

// CountUpNumber animates from 0 to value (number or string), formatted with commas
const CountUpNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const [mounted, setMounted] = useState(false);
  const controls = useAnimation();
  const numericValue = typeof value === "string"
    ? parseInt(value.replace(/[^\d]/g, ""), 10)
    : value;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      controls.start({ count: numericValue });
    }
  }, [numericValue, controls, mounted]);

  if (!mounted) {
    // Render the final value on the server for hydration match
    return <span>{numericValue.toLocaleString("en-US")}</span>;
  }

  return (
    <motion.span
      initial={{ count: 0 }}
      animate={controls}
      transition={{ duration: 1.4, ease: "easeOut" }}
      onUpdate={latest => {
        setDisplay(Math.round(latest.count));
      }}
    >
      {display.toLocaleString("en-US")}
    </motion.span>
  );
};

export default CountUpNumber;
