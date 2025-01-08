'use client';
import { useAppSelector } from "@/hooks/store.hooks";
import axios from "axios";
import { useEffect } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid2';
import Image from "next/image";
import toast from "react-hot-toast";
import { UserData } from "@/types/user.types";


const drawerWidth = 240;


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

export default function ProfilePage() {
    const { token } = useAppSelector((store) => store.userReducer);
    const [userData, setUserData] = React.useState<null | UserData>(null);
    /* API logged user */
    async function getLoggedInUser() {
        try {
            const options = {
                url: "https://linked-posts.routemisr.com/users/profile-data",
                method: "GET",
                headers: { token },
            };
            const { data } = await axios.request(options);
            console.log(data);
            if (data.message === "success") {
                setUserData(data.user);
            }
        } catch (error) {
            console.log(error);
        }
    }
    /* API upload profile pic */
    const file = React.useRef<HTMLInputElement | null>(null)
    async function uploadProfilePic() {
        try {
            if (!file.current || !file.current.files || file.current.files.length === 0) {
                toast.error("Error uploading picture, please try again!");
                return;
            }
            const formData = new FormData();
            formData.append("photo", file.current.files[0]);

            const options = {
                url: "https://linked-posts.routemisr.com/users/upload-photo",
                method: "PUT",
                headers: { token },
                data: formData,
            };
            const { data } = await axios.request(options);
            console.log(data);
            if (data.message === "success") {
                toast.success("Profile pic updated successfully!");
                getLoggedInUser();
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getLoggedInUser();
    }, []);

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>

                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Profile"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Sign Out"} />
                    </ListItemButton>
                </ListItem>

            </List>
            <Divider />
        </div>
    );


    return (
        <Box sx={{ display: "flex", zIndex: 90, justifyItems: 'center' }}>
            <CssBaseline />
            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                    zIndex: 1, // Lower z-index than the navbar
                }}
                aria-label="menu items"
            >
                {/* Permanent Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { display: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            height: "100vh",
                            mt: 4
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                    My Profile
                </Typography>
                <Box
                    sx={{
                        p: 2,
                        border: "3px solid #f1f1f9",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start"
                    }}
                >
                    {/* profile pic display */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {userData && <>
                            {!userData.photo.includes('default') ? <Image src={userData.photo} width={60} height={50} className="rounded-full shadow-lg" alt={userData.name} /> :
                                <AccountCircleIcon sx={{ fontSize: "60px" }} className="text-slate-600" />
                            }
                        </>
                        }
                        {userData && <Typography variant="overline" sx={{ fontWeight: "bold", position: 'relative', bottom: "10px", left: '3px' }}>
                            {userData.name}
                        </Typography>}
                    </Box>
                    <Button component="label"
                        sx={{ my: 1, width: "auto", borderRadius: '3000px' }}
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload Picture
                        <VisuallyHiddenInput
                            type="file"
                            onChange={uploadProfilePic}
                            multiple
                            ref={file}
                        />
                    </Button>
                </Box>
                <Box
                    sx={{
                        p: 2,
                        my: 5,
                        border: "3px solid #f1f1f9",
                        borderRadius: "8px",
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                        Personal Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={6} component="div">
                            <Typography className="text-slate-600">Name</Typography>
                            {userData && <Typography sx={{ fontWeight: 'bold' }}>{userData.name}</Typography>}
                        </Grid>
                        <Grid size={6} component="div">
                            <Typography className="text-slate-600">Email</Typography>
                            {userData && <Typography sx={{ fontWeight: 'bold' }}>{userData.email}</Typography>}
                        </Grid>
                        <Grid size={6} component="div">
                            <Typography className="text-slate-600">Birth date</Typography>
                            {userData && <Typography sx={{ fontWeight: 'bold' }}>{userData.dateOfBirth}</Typography>}
                        </Grid>
                    </Grid>
                </Box>

            </Box>
        </Box >
    );
}
