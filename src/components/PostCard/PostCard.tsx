'use client'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatIcon from '@mui/icons-material/Chat';
import { Comments, Post } from '@/types/posts.types';
import Image from 'next/image';
import CommentCard from '../CommentCard/CommentCard';
import { Box, Button, Divider, TextField } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/store.hooks';
import axios from 'axios';
import toast from 'react-hot-toast';





export default function PostCard({ postData }: { postData: Post }) {
    const { token } = useAppSelector((store) => store.userReducer);
    const [firstComment, setFirstComment] = React.useState<Comments[]>([]);
    const [comments, setComments] = React.useState(postData.comments.slice(0, 20)); // Initial comments
    const [page, setPage] = React.useState(1); // Current page
    const [hasMore, setHasMore] = React.useState(postData.comments.length > 20); // Check if more comments exist
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = () => {
        if (inputRef.current) {
            addComment(postData._id, inputRef.current.value);
            inputRef.current.value = ''; // Clear the input manually
        }
    };
    async function addComment(id: string, commentText: string) {
        try {
            const options = {
                url: "https://linked-posts.routemisr.com/comments",
                method: 'POST',
                headers: {
                    token
                },
                data: { post: postData._id, content: commentText }
            }
            const { data } = await axios.request(options);
            console.log(data);
            if (data.message === 'success') {
                if (data?.comments?.[0]) {
                    setFirstComment([data.comments[0], ...firstComment]);
                }
                toast.success("comment added!!!")
            }
        } catch (error) {
            console.log(error);
            toast.error("Error adding comment!!!")
        }
    }
    const loadMoreComments = React.useCallback(() => {
        const nextPage = page + 1;
        const startIndex = nextPage * 30;
        const newComments = postData.comments.slice(startIndex, startIndex + 30);

        setComments((prev) => [...prev, ...newComments]);
        setPage(nextPage);
        if (startIndex + 30 >= postData.comments.length) {
            setHasMore(false); // No more comments to load
        }
    }, [page, postData.comments]);
    const observer = React.useRef<IntersectionObserver | null>(null);
    const lastCommentRef = React.useCallback((node: HTMLElement | null) => {
        if (!hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMoreComments();
            }
        });
        if (node) observer.current.observe(node);
    }, [loadMoreComments, hasMore])

    const path = usePathname()
    const router = useRouter()
    return (
        <Card sx={{ maxWidth: '95%', mx: 'auto', mt: 3 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        <Image src={postData.user.photo} alt={postData.user.name} width={50} height={50} className='object-cover' />
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={postData.user.name}
                subheader={new Date(postData.createdAt).toLocaleDateString('en-GB')}
            />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {postData.body}
                </Typography>
            </CardContent>
            {postData.image && <CardMedia
                component="img"
                sx={{ height: 250 }}
                image={postData.image}
                alt={`${postData.user.name}'s post image`}
            />}

            <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton aria-label="share">
                    <ThumbUpAltIcon />
                </IconButton>
                <IconButton aria-label="add to favorites">
                    <ChatIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>

            </CardActions>
            <Divider>Comments</Divider>
            {path === `/postDetail/${postData._id}` ?
                postData.comments.length > 0 && <Box sx={{ p: 2 }}>
                    <TextField multiline minRows={2} placeholder='Write a Comment...' fullWidth sx={{ mt: 1 }}
                        inputRef={inputRef}
                        name='comment'
                        onKeyUp={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                    />
                    <Button variant='contained' fullWidth sx={{ mt: 0, mb: 2 }} onClick={handleSubmit}>Send</Button>
                    {firstComment && firstComment.map((typedComment: Comments) => <CommentCard commentInfo={typedComment} key={typedComment._id} />)}
                    {comments.map((comment, index) => {
                        if (index === comments.length - 1) {
                            return (
                                <div key={comment._id} ref={lastCommentRef}>
                                    <CommentCard commentInfo={comment} />
                                </div>
                            );
                        }
                        return (
                            <div key={comment._id}>
                                <CommentCard commentInfo={comment} />
                            </div>
                        );
                    })}
                </Box>
                :

                <Box sx={{ p: 2 }}>
                    {postData.comments.length > 0 && <>
                        {firstComment.length > 0 ? <CommentCard commentInfo={firstComment[0]} /> : <CommentCard commentInfo={postData.comments[0]} />}
                        <Button variant='contained' fullWidth sx={{ mt: 0, mb: 2 }} onClick={() => { router.push(`/postDetail/${postData._id}`) }}>Show More Comments</Button>
                    </>}
                    <TextField multiline minRows={2} placeholder='Write a Comment...' fullWidth
                        inputRef={inputRef} name='comment'
                        onKeyUp={(e) => { if (e.key === 'Enter') handleSubmit(); }} />
                    <Button variant='contained' fullWidth sx={{ mt: 0, mb: 2 }} onClick={handleSubmit}>Send</Button>
                </Box>
            }
        </Card>
    );
}
