'use client'

import Loading from "@/components/Loading/Loading";
import PostCard from "@/components/PostCard/PostCard";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hooks"
import { getPostDetail } from "@/store/features/post.slice";
import { use, useEffect } from "react"

function Page({params}: {params: Promise<{postId: string}>}) {
    const {postId} = use(params)
    const dispatch = useAppDispatch();
    
    useEffect(()=>{
        dispatch(getPostDetail(postId)) // fetch post data from the server
    },[])
    const {postDetail} = useAppSelector((store)=> store.postReducer);
    
    return <>
        {postDetail? <PostCard postData={postDetail}/> : <Loading/>}
    </>
}

export default Page
