import React from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import OrderTable from './OrderTable';
import { useSelector } from 'react-redux';
import useOrderFilter from '../../../hooks/useOrderFilter';
import SellerOrderTable from './SellerOrderTable';

const Orders = () => {
    const { adminOrder, pagination } = useSelector((state) => state.order);
    const { user } = useSelector(state => state.auth);
    const isAdmin = user?.roles.includes("ROLE_ADMIN");

    useOrderFilter();

    const emptyOrders = !adminOrder || adminOrder?.length === 0;
    return (
        <div className='pb-6 pt-20'>
            {emptyOrders ? (
                <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
                    <FaShoppingCart size={50} className='mb-3'/>
                    <h2 className='text-2xl font-semibold'>No Orders Placed Yet</h2>
                </div>
            ) : (
                isAdmin ? (
                    <OrderTable adminOrder={adminOrder} pagination={pagination}/>
                ) : (
                    <SellerOrderTable sellerOrders={adminOrder} pagination={pagination}/>
                )
            )}
        </div>
    )
}

export default Orders