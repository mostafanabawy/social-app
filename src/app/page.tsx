'use client'
import PostCard from "@/components/PostCard/PostCard";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { useAppDispatch, useAppSelector } from "@/hooks/store.hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { getPosts } from "@/store/features/post.slice";
import Loading from './../components/Loading/Loading';
import PostForm from "@/components/PostForm/PostForm";
import CircularProgress from '@mui/material/CircularProgress';
// loading and not found to be created later
export default function Home() {
  const dispatch = useAppDispatch();
  const [pageNum, setPageNum] = useState(0)
  const [loading, setLoading] = useState(false)

  const { posts } = useAppSelector((store) => store.postReducer)
  
  useEffect(() => {
    console.log(pageNum + 'try');
    setLoading(true)
    dispatch(getPosts(pageNum)).then(() =>{})
  }, [pageNum])
  useEffect(() => {
    setLoading(false);
    console.log(posts);
  }, [posts])

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLElement | null) => {
    if (!posts) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPageNum(pageNum + 1);
        setLoading(true)
      }
    });
    if (node) observer.current.observe(node);
  }, [posts])
  return <>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={3}>
        </Grid>
        <Grid size={6} sx={{ p: 2 }}>
          <PostForm />
          {posts ? posts.map((post, index) => {
            
            if (index === posts.length - 1) {
              return (
                <div ref={lastPostElementRef} key={post._id}>
                  <PostCard postData={post} />
                </div>
              );
            }
            return <PostCard key={post._id} postData={post} />;
          }) :
            <Loading />}
          <Box sx={{ display: 'flex', justifyContent: "center" }}>
            {loading && <CircularProgress sx={{ mx: 'auto', mt: 3 }} />}
          </Box>
        </Grid>
        <Grid size={3}>
        </Grid>
      </Grid>
    </Box>
  </>
}
