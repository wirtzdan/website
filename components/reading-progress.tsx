import { Box, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState, type RefObject } from "react";

interface ReadingProgressProps {
  target: RefObject<HTMLElement | null>;
}

const ReadingProgress = ({ target }: ReadingProgressProps) => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const scrollListener = () => {
      if (!target.current) {
        return;
      }

      const element = target.current;
      const totalHeight =
        element.clientHeight - element.offsetTop - window.innerHeight;
      const windowScrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (windowScrollTop === 0) {
        setReadingProgress(0);
        return;
      }

      if (windowScrollTop > totalHeight) {
        setReadingProgress(100);
        return;
      }

      setReadingProgress((windowScrollTop / totalHeight) * 100);
    };

    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, [target]);

  return (
    <Box
      position="fixed"
      bg={useColorModeValue("blue.500", "blue.200")}
      left={0}
      right={0}
      top={{ base: "auto", md: "16" }}
      bottom={{ base: "16", md: "auto" }}
      h="2px"
      transition="all 0.10s"
      transitionTimingFunction="spring(1 100 10 10)"
      mt="-2px"
      w={`${readingProgress}%`}
      zIndex={100}
      transform={{ base: "translateY(2px)", md: "translateY(2px)" }}
    />
  );
};

export default ReadingProgress;
