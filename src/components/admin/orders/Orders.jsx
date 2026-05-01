import React from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import OrderTable from './OrderTable';
import { useSelector } from 'react-redux';
import useOrderFilter from '../../../hooks/useOrderFilter';

const Orders = () => {
    // const adminOrder = [{ "orderId": 7, "email": "user1@example.com", "orderItems": [{ "orderItemId": 14, "product": { "productId": 103, "productName": "Blender", "image": "1278a9e4-8f6a-4b04-9073-4b341f110671.jpg", "description": "High-performance Blender having powerful features for modern family", "quantity": 27, "price": 500.0, "discount": 15.0, "specialPrice": 425.0 }, "quantity": 1, "discount": 15.0, "orderedProductPrice": 425.0 }], "orderDate": "2026-04-24", "payment": { "paymentId": 7, "paymentMethod": "online", "pgPaymentId": "pi_1TPk5ZGE9N9OX9ODOcSj8aLn", "pgStatus": "succeeded", "pgResponseMessage": "Payment Successful", "pgName": "Stripe" }, "totalAmount": 425.0, "orderStatus": "Order Accepted!", "addressId": 1 }, { "orderId": 5, "email": "user1@example.com", "orderItems": [{ "orderItemId": 12, "product": { "productId": 156, "productName": "Clean Code", "image": "6b7c4147-e20c-4625-8c14-d37be683b004.jpg", "description": "A handbook of agile software craftsmanship", "quantity": 95, "price": 600.0, "discount": 5.0, "specialPrice": 570.0 }, "quantity": 1, "discount": 5.0, "orderedProductPrice": 570.0 }], "orderDate": "2026-04-24", "payment": { "paymentId": 5, "paymentMethod": "online", "pgPaymentId": "pi_1TPhB5GE9N9OX9ODBzcqd0Ih", "pgStatus": "succeeded", "pgResponseMessage": "Payment Successful", "pgName": "Stripe" }, "totalAmount": 570.0, "orderStatus": "Order Accepted!", "addressId": 1 }, { "orderId": 9, "email": "user1@example.com", "orderItems": [{ "orderItemId": 16, "product": { "productId": 207, "productName": "Premium Eco-Friendly Anti-Slip Yoga Mat with Extra Cushioning, Moisture Resistance, Lightweight Design for Home, Gym and Outdoor Workouts", "image": "6f8f3c69-9254-40a3-a7bc-8e5f82ea8f23.webp", "description": "Durable eco-friendly yoga mat with anti-slip texture, superior cushioning, and moisture resistance. Lightweight, easy to carry, perfect for yoga, stretching, and workouts anywhere.", "quantity": 59, "price": 1200.0, "discount": 12.0, "specialPrice": 1056.0 }, "quantity": 1, "discount": 12.0, "orderedProductPrice": 1056.0 }], "orderDate": "2026-04-25", "payment": { "paymentId": 9, "paymentMethod": "online", "pgPaymentId": "pi_1TQ3tgGE9N9OX9ODeGrOpR80", "pgStatus": "succeeded", "pgResponseMessage": "Payment Successful", "pgName": "Stripe" }, "totalAmount": 1056.0, "orderStatus": "Order Accepted!", "addressId": 1 } ];
    // const pagination = {"pageNumber": 0, "pageSize": 50, "totalElements": 9, "totalPages": 1, "lastPage": true};

    const { adminOrder, pagination } = useSelector((state) => state.order);

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
                <OrderTable adminOrder={adminOrder} pagination={pagination}/>
            )}
        </div>
    )
}

export default Orders