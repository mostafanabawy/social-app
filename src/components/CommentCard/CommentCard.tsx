import { Avatar, CardHeader, IconButton, Typography, Box } from "@mui/material"
import Image from "next/image"
import { Comments } from "@/types/posts.types";
import { red } from "@mui/material/colors";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

function CommentCard({ commentInfo }: { commentInfo: Comments }) {

    return <>
        <Box sx={{bgcolor:"#f1f1f1", px:3, py:2, borderRadius:'8px', mt:1, mb:0}}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {
                            !commentInfo.commentCreator?.photo?.includes("undefined") ? <Image src={commentInfo.commentCreator.photo} alt={commentInfo.commentCreator.name} width={50} height={50} />
                            : <Typography>{commentInfo.commentCreator.name[0]}</Typography>
                        }
                    </Avatar>
                }
                action={
                    <IconButton aria-label="emote">
                        <ThumbUpOffAltIcon />
                    </IconButton>
                }
                title={commentInfo.commentCreator.name}
                subheader={new Date(commentInfo.createdAt).toLocaleDateString()}
            />
            <Typography component={'p'} sx={{pl:9}}>
                {commentInfo.content}
            </Typography>
        </Box>
    </>
}

export default CommentCard
