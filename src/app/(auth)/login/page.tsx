'use client'
import { Button, Container, Paper, TextField } from "@mui/material"
import { useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton'
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { login } from "@/store/features/user.slice";
import { useAppDispatch } from "@/hooks/store.hooks";
import { useRouter } from "next/navigation";

function Login() {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: object({
            email: string()
                .email('Invalid email address')
                .required('Email is required'),
            password: string()
                .min(8, 'Password must be at least 8 characters long')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            dispatch(login(values)).then((res) => {
                if(res.payload.message === "success") {
                    router.push("/");
                }
                setLoading(false);
            }).catch((error) => {
                console.log(error);
                setLoading(false);
            })
        }
    })


    return <>
        <Container component="main">
            {/* Login Form */}
            <Paper sx={{ maxWidth: '400px', p: 4, my: 20, mx: 'auto' }} elevation={6}>
                <h2 className="text-2xl font-semibold mb-5">Login</h2>
                <form onSubmit={formik.handleSubmit}>
                    <TextField label="Email" variant="outlined" type="email" fullWidth sx={{ mb: 2 }}
                        value={formik.values.email} name={"email"} onChange={formik.handleChange} />
                    <TextField label="Password" type={'password'} variant="outlined" fullWidth sx={{ mb: 2 }}
                        value={formik.values.password} name={"password"} onChange={formik.handleChange} />
                    <LoadingButton
                        size="large"
                        startIcon={<LoginIcon />}
                        loading={loading}
                        loadingPosition="start"
                        variant="contained"
                        type={'submit'}
                        sx={{
                            backgroundColor: 'primary.main', // Set the background color explicitly
                            color: 'white', // Ensure text color remains white
                            '&.MuiLoadingButton-loading': {
                                backgroundColor: 'primary.main', // Keep background color during loading
                                color: 'white', // Keep text color white during loading
                                '& .MuiCircularProgress-root': {
                                    color: 'white', // Ensure loader color stays white
                                },
                            },
                            '&.MuiLoadingButton-loading.Mui-disabled': {
                                backgroundColor: 'primary.main', // Ensure background doesn't change when disabled
                                color: 'white', // Keep text color white when disabled
                            },
                        }}
                    >
                        LOGIN
                    </LoadingButton>
                    <Button
                        size="large"
                        href="/signup"
                        startIcon={<PersonIcon />}
                        variant="contained"
                        type={'button'}
                        sx={{
                            backgroundColor: 'red', // Set the background color explicitly
                            color: 'white', // Ensure text color remains white
                            mx: 1
                        }}
                    >
                        Signup
                    </Button>
                </form>
            </Paper>
        </Container >
    </>
}

export default Login
