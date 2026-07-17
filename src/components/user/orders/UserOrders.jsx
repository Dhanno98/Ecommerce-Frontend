import React from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import UserOrderTable from './UserOrderTable';
import { useSelector } from 'react-redux';
import useUserOrderFilter from '../../../hooks/useUserOrderFilter';

const UserOrders = () => {
    const { userOrders, userPagination } = useSelector((state) => state.order);

    useUserOrderFilter();

    const emptyOrders = !userOrders || userOrders?.length === 0;
    return (
        <div className='pb-6 pt-20'>
            {emptyOrders ? (
                <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
                    <FaShoppingCart size={50} className='mb-3'/>
                    <h2 className='text-2xl font-semibold'>No Orders Yet</h2>
                </div>
            ) : (
                <UserOrderTable userOrder={userOrders} pagination={userPagination}/>
            )}
        </div>
    )
}

export default UserOrders