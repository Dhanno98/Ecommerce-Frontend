import React, { useState } from 'react'
import InputField from '../../shared/InputField'
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Spinners from '../../shared/Spinners';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addNewDashboardSeller } from '../../../store/actions';

const AddSellerForm = ({ setOpen }) => {
    const[loader, setLoader] = useState(false);
    const { sellers } = useSelector((state) => state.seller);
    const { errorMessage } = useSelector((state) => state.errors);

    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        mode: "onTouched"
    });

    const saveSellerHandler = (data) => {
        const sendData = {
            ...data,
            role: ["seller"],
        };
        dispatch(addNewDashboardSeller(sendData, toast, reset, setOpen, setLoader));
    };

    return (
        <div className='py-5 relative h-full'>
            <form className='space-y-4'
                onSubmit={handleSubmit(saveSellerHandler)}>
                <div className='flex md:flex-row flex-col gap-4 w-full'>
                    <InputField 
                        label="UserName"
                        required
                        id="username"
                        type="text"
                        message="Username is required*"
                        placeholder="Enter your username"
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className='flex md:flex-row flex-col gap-4 w-full'>
                    <InputField 
                        label="Email"
                        required
                        id="email"
                        type="email"
                        message="Email is required*"
                        placeholder="Enter your email"
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className='flex md:flex-row flex-col gap-4 w-full'>
                    <InputField 
                        label="Password"
                        required
                        id="password"
                        type="password"
                        message="Password is required*"
                        placeholder="Enter password"
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className='flex w-full justify-between items-center absolute bottom-14'>
                    <Button disabled={loader}
                            onClick={() => setOpen(false)}
                            variant='outlined'
                            className='text-white py-[10px] px-4 text-sm font-medium'
                    >
                        Cancel
                    </Button>

                    <Button disabled={loader}
                            type='submit'
                            variant='contained'
                            color='primary'
                            className='bg-custom-blue text-white py-[10px] px-4 text-sm font-medium'
                    >
                        {loader ? (
                            <div className='flex gap-2 items-center'>
                                <Spinners /> Loading...
                            </div>
                        ) : (
                            "Add New Seller"
                        )}
                    </Button>
                </div>
            </form>

        </div>
    )
}

export default AddSellerForm