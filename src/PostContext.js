import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize the derived state for searchedPosts
  const searchedPosts = useMemo(() => {
    return searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;
  }, [posts, searchQuery]);

  // const handleAddPost = useCallback((post) => {
  //   setPosts((prevPosts) => [post, ...prevPosts]);
  // }, []);

  const handleClearPosts = useCallback(() => {
    setPosts([]);
  }, []);

  // Memoize the context value
  const value = useMemo(
    () => ({
      posts: searchedPosts,
      // onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
      setPosts
    }),
    [searchedPosts, handleClearPosts, searchQuery]
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
}

export { PostProvider, usePosts };
