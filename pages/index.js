import React from "react";
// import fs from "fs";
import Head from "next/head";
import {
  Button,
  Box,
  VStack,
  Text,
  Heading,
  SimpleGrid,
  Stack,
  HStack,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import sorter from "sort-isostring";
import { getBlogPosts } from "@/lib/notion/api";
import Link from "@/components/link";
import SubscribeCard from "@/components/subscribe-card";
import BlogListItem from "@/components/blog-list-item";
import generateRssIcon from "@/lib/rss";
import Subscribe from "@/components/subscribe";
import Hero from "@/components/hero";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import Layout from "@/layouts/layout";
import { motion } from "framer-motion";

const RecordingDot = () => (
  <Box position="relative" display="inline-flex" alignItems="center" mt="1px">
    <motion.div
      style={{
        width: 6,
        height: 6,
        backgroundColor: "red",
        borderRadius: "50%",
        display: "inline-block",
        position: "relative",
        zIndex: 2,
      }}
    />
    <motion.div
      style={{
        width: 6,
        height: 6,
        backgroundColor: "red",
        borderRadius: "50%",
        position: "absolute",
        left: 0,
      }}
      animate={{
        scale: 2.5,
        opacity: 0
      }}
      initial={{
        scale: 1,
        opacity: 0.3
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </Box>
);

const Home = ({ posts }) => (
  <Layout>
    <VStack spacing={16}>
      <Section>
        <VStack spacing={4} align="start" >
          <VStack
            // w="100%"
            spacing={6}
            // rounded="lg"
            // borderWidth="1px"
            // bg={useColorModeValue("white", "neutralD.100")}
            // borderColor={useColorModeValue("neutral.400", "neutralD.400")}
            // p={8}
            align="start"
            // // height={48}
          >
            <HStack justify="space-between" w="100%" align="center" fontSize="2xl">
              <Heading size="lg" align="left">
                Hey there. 👋
              </Heading>
              <Link href="/about" legacyBehavior>
                <Button
                  variant="ghost"
                  rightIcon={<Icon as={ArrowUpRightIcon} />}
                  size={["sm", "md"]}
                >
                  Read more
                </Button>
              </Link>
            </HStack>
            <Text fontSize={["lg", "2xl"]} >
              I'm Daniel. I'm a german designer, developer and maker of sorts who lives in the
              Netherlands. I like to read <Link href="/books"> books</Link>,
              save <Link href="/bookmarks">bookmarks</Link> and to occasionally
              write <Link href="/blog">articles</Link>.
            </Text>
            <VStack 
              bg={useColorModeValue("white", "neutralD.100")}
              borderColor={useColorModeValue("neutral.400", "neutralD.400")}
              p={4}
              rounded="md"
              borderWidth="1px"
              spacing={2}
              align="start"
            >
              <HStack spacing={2} align="center">
                <Text fontWeight="bold" fontSize="lg">Now</Text>
                <RecordingDot />
              </HStack>
              <Text fontSize="md" >
                I'm currently working on <Link href="https://markway.io/">Markway</Link>, a web extension for note-taking enthusiasts who want to highlight and annotate websites. You can <Link href="https://discord.gg/AdXhQ9P7">join the Discord community </Link>to follow the development and test early releases!
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </Section>
      <Section>
        <VStack align="start" spacing={8}>
          <HStack justify="space-between" w="100%" align="center">
            <Heading size="lg">Latest Posts</Heading>
            <Link href="/blog" legacyBehavior>
              <Button
                size={["sm", "md"]}
                variant="ghost"
                rightIcon={<Icon as={ArrowUpRightIcon} />}
              >
                View all
              </Button>
            </Link>
          </HStack>
          <SimpleGrid columns={1} spacing={4} w="100%">
            {posts.results
              .filter((post) => post.isPublished)
              .sort((x, y) => new Date(y.publishDate) - new Date(x.publishDate))
              .slice(0, 3)
              .map((post) => {
                return <BlogListItem key={post.id} {...post} />;
              })}
          </SimpleGrid>
        </VStack>
      </Section>
      <Section>
        <VStack align="start" spacing={8}>
          <Heading size="lg">Subscribe</Heading>
          <VStack spacing={4}>
            <Text>
              If you want to stay up to date with my latest posts you can sign
              up to my newsletter. I promise I won't spam you. (To be honest,
              I'm not the best at keeping up with a newsletter schedule...)
            </Text>
            <SubscribeCard card={false} title="" description="" />
          </VStack>
        </VStack>
      </Section>
    </VStack>
  </Layout>
);

export async function getStaticProps() {
  const posts = await getBlogPosts(9999);
  //const rss = await generateRssIcon(posts);
  // fs.writeFileSync("./public/rss.xml", rss);

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}

export default Home;
