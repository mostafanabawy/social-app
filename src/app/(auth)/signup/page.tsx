'use client'
import LoadingButton from "@mui/lab/LoadingButton"
import { Paper, TextField, Container, RadioGroup, Radio, FormControlLabel } from "@mui/material"
import LoginIcon from '@mui/icons-material/Login';
import { useFormik } from "formik";
import { date, object, ref, string } from "yup";
import { useAppDispatch } from "@/hooks/store.hooks";
import { signup } from "@/store/features/user.slice";
import { useState } from "react";

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from "next/navigation";

function Page() {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter()
    const formik = useFormik({
        initialValues: {
            "name": "",
            "email": "",
            "password": "",
            "rePassword": "",
            "dateOfBirth": "",
            "gender": ""
        },
        validationSchema: object({
            name: string().required('Name is required'),
            email: string().email('Invalid email format').required('Email is required'),
            password: string().required('Password is required').min(6, 'Password must be at least 6 characters long'),
            rePassword: string().required('Confirm Password is required').oneOf([ref('password')], 'Passwords must match'),
            dateOfBirth: date().required('Date of Birth is required'),
            gender: string().required('Gender is required')
        }),
        onSubmit: async (values) => {
            console.log('helooooooooooo');
            console.log(formik.errors);
            console.log(formik.values);
            setLoading(true);
            dispatch(signup(values)).then((res) => {
                if(res.payload.message === 'success'){
                    router.push('/login')
                }
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            });
        }
    })

    return <>
        <Container component="main">
            {/* Login Form */}
            <Paper sx={{ maxWidth: '400px', p: 4, my: 20, mx: 'auto' }} elevation={6}>
                <h2 className="text-2xl font-semibold mb-5">Signup</h2>
                <form onSubmit={formik.handleSubmit}>
                    <TextField label="name" type={'text'} variant="outlined" fullWidth sx={{ mb: 2 }}
                        value={formik.values.name} name={"name"} onChange={formik.handleChange} />

                    <TextField label="Email" variant="outlined" type="email" fullWidth sx={{ mb: 2 }}
                        value={formik.values.email} name={"email"} onChange={formik.handleChange} />

                    <TextField label="Password" type={'password'} variant="outlined" fullWidth sx={{ mb: 2 }}
                        value={formik.values.password} name={"password"} onChange={formik.handleChange} />

                    <TextField label="rePassword" type={'password'} variant="outlined" fullWidth sx={{ mb: 2 }}
                        value={formik.values.rePassword} name={"rePassword"} onChange={formik.handleChange} />

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                        <DemoContainer components={['DateField', 'DatePicker']}>
                            <DatePicker
                                label="Date Of Birth"
                                value={formik.values.dateOfBirth ? dayjs(formik.values.dateOfBirth) : null} // Convert string to Dayjs
                                onChange={(newValue) => {
                                    formik.setFieldValue('dateOfBirth', newValue ? newValue.format('DD-MM-YYYY') : '');
                                }}
                                name={"dateOfBirth"}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <RadioGroup name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        sx={{ mb: 3 }}>
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>

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
                        Signup
                    </LoadingButton>

                </form>
            </Paper>
        </Container >
    </>
}

export default Page
