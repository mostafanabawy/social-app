'use client'
import { Box, Button, styled, TextField } from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from "@mui/lab/LoadingButton";
import { useRef, useState } from "react";
import { useAppSelector } from "@/hooks/store.hooks";
import axios from "axios";
import toast from "react-hot-toast";


function PostForm() {
    const { token } = useAppSelector((store) => store.userReducer);
    const postContentRef = useRef<HTMLInputElement>(null);
    const postFileRef = useRef<HTMLInputElement>(null);
    async function createPost() {
        const id1 = toast.loading("uploading post...")
        const content = postContentRef.current?.value || "";
        const file = postFileRef.current?.files?.[0];
        const postData = new FormData();
        postData.append('body', content);
        if (file) {
            console.log(postFileRef.current?.files);
            postData.append('image', file);
        }
        for (const [key, value] of postData.entries()) {
            console.log(key, value);
        }
        const options = {
            url: "https://linked-posts.routemisr.com/posts",
            method: 'POST',
            headers: {
                token
            },
            data: postData
        }
        const { data } = await axios.request(options)
        if (data.message === 'success') {
            toast.success("Post published !")
            if (postContentRef.current) {
                postContentRef.current.value = "";
            }
            
            if (postFileRef.current) {
                postFileRef.current.value = "";
            }
            toast.dismiss(id1)
        } else {
            toast.error("Failed to publish post!")
            toast.dismiss(id1)
        }
    }
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    const [loading, setLoading] = useState(false);
    async function handleClick() {
        setLoading(true);
        await createPost()
        setLoading(false);
    }


    return <>
        <Box sx={{ maxWidth: '95%', mx: 'auto', mt: 3 }}>
            <TextField multiline minRows={7} placeholder="What's on your mind?" fullWidth inputRef={postContentRef} />
            <Box sx={{ maxWidth: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    sx={{ my: 1 }}
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload files
                    <VisuallyHiddenInput
                        type="file"
                        onChange={() => {toast.success('file uploaded')}}
                        ref={postFileRef}
                    />
                </Button>
                <LoadingButton
                    sx={{ marginLeft: 1, my: 1 }}
                    size="medium"
                    onClick={handleClick}
                    endIcon={<SendIcon />}
                    loading={loading}
                    loadingPosition="end"
                    variant="contained"
                >
                    Send
                </LoadingButton>
            </Box>
        </Box>
    </>
}

export default PostForm
