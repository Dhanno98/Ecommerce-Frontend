import toast from "react-hot-toast";
import api from "../../api/api";

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type:"IS_FETCHING" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content, 
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage
        });
        dispatch({ type:"IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
        });
    }
};

export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type:"CATEGORY_LOADER" });
        const { data } = await api.get(`/public/categories/all`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data
        });
        dispatch({ type:"CATEGORY_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
        });
    }
};

export const addToCart = (data, qty = 1, toast, navigate) => async(dispatch, getState) => {
    const { user } = getState().auth;
    if (!user) {
        toast.error("Please login to add items to cart.");
        navigate("/login");
        return;
    }

    // Find the product
    const { products } = getState().products;
    const getProduct = products.find(
        (item) => item.productId === data.productId
    );

    // Check for stocks
    const isQuantityExists = getProduct.quantity >= qty;
    if (!isQuantityExists) {
        toast.error("Out of stock");
        return;
    }

    dispatch({ type: "ADD_TO_CART_LOADING", payload: data.productId, });

    try {
        await api.post(`/carts/products/${data.productId}/quantity/${qty}`);
        await dispatch(getUserCart(false));
        toast.success(`${data?.productName} added to the cart`);
    } catch (error) {
        toast.error(error?.response?.data?.message || "Unable to add item to cart");
    } finally {
        dispatch({ type: "ADD_TO_CART_FINISHED" })
    }
}

export const increaseCartQuantity = (data, toast) => async (dispatch) => {
    try {
        await api.put(`/cart/products/${data.productId}/quantity/add`);

        await dispatch(getUserCart(false));

    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            "Quantity Reached to Limit"
        );
    }
};

export const decreaseCartQuantity = (data, toast) => async (dispatch) => {
    try {
        await api.put(`/cart/products/${data.productId}/quantity/delete`);

        await dispatch(getUserCart(false));

    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            "Unable to decrease quantity"
        );
    }
}

export const removeFromCart = (data, toast) => async (dispatch) => {
    try {
        await api.delete(`/cart/products/${data.productId}`);

        await dispatch(getUserCart(false));

        toast.success(`${data.productName} removed from cart`);
    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            "Unable to remove item from cart"
        );
    }
}

export const authenticateSignInUser 
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signin", sendData);
            dispatch({ type:"LOGIN_USER", payload:data });
            localStorage.setItem("auth", JSON.stringify(data));
            reset();
            toast.success("Login Success");
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Internal Server Error");
        } finally {
            setLoader(false);
        }
};

export const registerNewUser
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signup", sendData);
            reset();
            toast.success(data?.message || "User Registered Successfully");
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.response?.data?.password || "Internal Server Error");
        } finally {
            setLoader(false);
        }
};

export const logOutUser = (navigate) => (dispatch) => {
    dispatch({ type: "CLEAR_CART" });
    dispatch({ type: "REMOVE_CHECKOUT_ADDRESS" });
    dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS" });
    dispatch({ type: "LOG_OUT" });

    localStorage.removeItem("auth");
    localStorage.removeItem("CHECKOUT_ADDRESS");
    localStorage.removeItem("client-secret");

    navigate("/login");
};

export const addUpdateUserAddress = 
    (sendData, toast, addressId, setOpenAddressModal) => async (dispatch, getState) => {
        // const { user } = getState().auth;
        dispatch({ type: "BUTTON_LOADER" });
        try {
            if (!addressId) {
                const { data } = await api.post("/addresses", sendData);
            } else {
                await api.put(`/addresses/${addressId}`, sendData);
            }
            dispatch(getUserAddresses());
            toast.success("Address Saved Successfully");
            dispatch({ type:"IS_SUCCESS" });
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Internal Server Error");
            dispatch({ type:"IS_ERROR", payload:null });
        } finally {
            setOpenAddressModal(false);
        }
};

export const getUserAddresses = () => async (dispatch, getState) => {
    try {
        dispatch({ type:"IS_FETCHING" });
        const { data } = await api.get(`/users/addresses`);
        dispatch({type: "USER_ADDRESS", payload: data});
        dispatch({ type:"IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch user addresses",
        });
    }
};

export const deleteUserAddress = (toast, addressId, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
        dispatch({ type:"BUTTON_LOADER" });
        await api.delete(`/addresses/${addressId}`);
        dispatch({ type:"IS_SUCCESS" });
        dispatch(getUserAddresses());
        dispatch(clearCheckoutAddress());
        toast.success("Address deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Some Error occured",
        });
    } finally {
        setOpenDeleteModal(false);
    }
};

export const clearCheckoutAddress = () => {
    return {
        type: "REMOVE_CHECKOUT_ADDRESS",
    }
};

export const selectUserCheckoutAddress = (address) => {
    localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));
    return {
        type: "SELECT_CHECKOUT_ADDRESS",
        payload: address,
    }
};

export const addPaymentMethod = (method) => {
    return {
        type: "ADD_PAYMENT_METHOD",
        payload: method,
    }
};

export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
    try {
        dispatch({ type:"IS_FETCHING" });
        await api.post('/cart/create', sendCartItems);
        await dispatch(getUserCart());

    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Failed to create cart items",
        });
    }
};

export const getUserCart = (showLoader = true) => async (dispatch, getState) => {
    try {
        if (showLoader) {
            dispatch({ type:"IS_FETCHING" });
        }
        const { data } = await api.get('/carts/users/cart')

        dispatch({
            type: "GET_USER_CART_PRODUCTS",
            payload: data.cartItems,
            totalPrice: data.totalPrice,
            cartId: data.cartId
        });

        if (showLoader) {
            dispatch({ type: "IS_SUCCESS" });
        }
    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch cart items",
        });
    }
};

export const createStripePaymentSecret
    = (sendData) => async (dispatch, getState) => {
        try {
            dispatch({ type:"IS_FETCHING" });
            const { data } = await api.post("/order/stripe-client-secret", sendData);
            dispatch({ type: "CLIENT_SECRET", payload: data });
            localStorage.setItem("client-secret", JSON.stringify(data));
            dispatch({ type: "IS_SUCCESS" });
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to create client secret");
        }
};

export const stripePaymentConfirmation
    = (sendData, setErrorMessage, setLoading, toast) => async (dispatch, getState) => {
        try {
            const response = await api.post("/order/users", sendData);
            console.log(response);
            if (response.data) {
                console.log("IN IF");
                localStorage.removeItem("CHECKOUT_ADDRESS");
                localStorage.removeItem("client-secret");
                dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS" });
                await dispatch(getUserCart(false));
                toast.success("Order Accepted");
            } else {
                setErrorMessage("Payment Failed. Please try again");
            }
        } catch (error) {
            setErrorMessage("Payment Failed. Please try again");
        }
};

export const analysticsAction = () => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING" });
            const { data } = await api.get('/admin/app/analytics');
            dispatch({
                type: "FETCH_ANALYTICS",
                payload: data,
            })
            dispatch({ type: "IS_SUCCESS" });
        } catch (error) {
            dispatch({ 
                type: "IS_ERROR",
                payload: error?.response?.data?.message || "Failed to fetch analytics data",
             });
        }
};

export const getOrdersForDashboard = (queryString, isAdmin) => async (dispatch) => {
    try {
        dispatch({ type:"IS_FETCHING" });
        const endpoint = isAdmin ? "/admin/orders" : "/seller/orders";
        const { data } = await api.get(`${endpoint}?${queryString}`);
        dispatch({
            type: "GET_ADMIN_ORDERS",
            payload: data.content, 
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage
        });
        dispatch({ type:"IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch orders data",
        });
    }
};

export const updateOrderStatusFromDashboard = 
    (orderId, orderStatus, toast, setLoader, isAdmin) => async (dispatch, getState) => {

        try {
            setLoader(true);
            const endpoint = isAdmin ? "/admin/orders/" : "/seller/orders/";
            const { data } = await api.put(`${endpoint}${orderId}/status`, {status: orderStatus});
            toast.success(data?.message|| "Order status updated successfully");
            await dispatch(getOrdersForDashboard());
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Internal Server Error");
        } finally {
            setLoader(false);
        }
};

export const dashboardProductsAction = (queryString, isAdmin) => async (dispatch) => {
    try {
        dispatch({ type:"IS_FETCHING" });
        const endpoint = isAdmin ? "/admin/products" : "/seller/products";
        const { data } = await api.get(`${endpoint}?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content, 
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage
        });
        dispatch({ type:"IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch dashboard products",
        });
    }
};

export const updateProductFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin) => async (dispatch) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.put(`${endpoint}${sendData.id}`, sendData);
        toast.success("Product update successful") ;
        reset();
        setLoader(false);
        setOpen(false);
        await dispatch(dashboardProductsAction());
    } catch (error) {
        toast.error(error?.response?.data?.description || "Product update failed");
    }
}

export const addNewProductFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/categories/" : "/seller/categories/";
        await api.post(`${endpoint}${sendData.categoryId}/product`, sendData);
        toast.success("Product created successfully");
        reset();
        setOpen(false);
        await dispatch(dashboardProductsAction());
    } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.description || "Product creation failed");
    } finally {
        setLoader(false);
    }
}

export const deleteProduct = 
    (setLoader, productId, toast, setOpenDeleteModal, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.delete(`${endpoint}${productId}`);
        toast.success("Product deleted successfully");
        setLoader(false);
        setOpenDeleteModal(false);
        await dispatch(dashboardProductsAction());
    } catch (error) {
        console.log(error);
        toast.error(
            error?.response?.data?.message || "Some Error occured"
        )
    }
};

export const updateProductImageFromDashboard = 
    (formData, productId, toast, setLoader, setOpen, isAdmin) => async (dispatch) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.put(`${endpoint}${productId}/image`, formData);
        toast.success("Image upload successful") ;
        setOpen(false);
        await dispatch(dashboardProductsAction());
    } catch (error) {
        toast.error(error?.response?.data?.description || "Product Image upload failed");
    } finally {
        setLoader(false);
    }
}

export const dashboardCategoriesAction = (queryString) => async (dispatch) => {
    try {
        dispatch({ type:"CATEGORY_LOADER" });
        const { data } = await api.get(`/admin/categories?${queryString}`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content, 
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage
        });
        dispatch({ type:"CATEGORY_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch dashboard categories",
        });
    }
};

export const updateCategoryFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen) => async (dispatch) => {
    try {
        setLoader(true);
        await api.put(`/admin/categories/${sendData.id}`, sendData);
        toast.success("Category update successful") ;
        reset();
        setLoader(false);
        setOpen(false);
        await dispatch(dashboardCategoriesAction());
    } catch (error) {
        toast.error(error?.response?.data?.description || "Category update failed");
    }
}

export const addNewCategoryFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen) => async (dispatch, getState) => {
    try {
        setLoader(true);
        await api.post(`/admin/categories`, sendData);
        toast.success("Category created successfully");
        reset();
        setOpen(false);
        await dispatch(dashboardCategoriesAction());
    } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.description || "Category creation failed");
    } finally {
        setLoader(false);
    }
}

export const deleteCategory = 
    (setLoader, categoryId, toast, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
        setLoader(true);
        await api.delete(`/admin/categories/${categoryId}`);
        toast.success("Category deleted successfully");
        setLoader(false);
        setOpenDeleteModal(false);
        await dispatch(dashboardCategoriesAction());
    } catch (error) {
        console.log(error);
        toast.error(
            error?.response?.data?.message || "Some Error occured"
        )
    }
};

export const getAllSellersDashboard = (queryString) => async (dispatch, getState) => {
    const { user } = getState().auth;
    try {
        dispatch({ type:"IS_FETCHING" });
        const { data } = await api.get(`/auth/admin/sellers?${queryString}`);
        dispatch({
            type: "GET_SELLERS",
            payload: data["content"], 
            pageNumber: data["pageNumber"],
            pageSize: data["pageSize"],
            totalElements: data["totalElements"],
            totalPages: data["totalPages"],
            lastPage: data["lastPage"],
        });

        dispatch({ type:"IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch sellers data",
        });
    }
};

export const addNewDashboardSeller = 
    (sendData, toast, reset, setOpen, setLoader) => async (dispatch) => {
    try {
        setLoader(true);
        const { data } = await api.post(`/auth/signup`, sendData);
        await api.post(`/auth/admin/users/${data.userId}/promote`, { role: "ROLE_SELLER" })
        reset();
        toast.success("Seller registered successfully");

        await dispatch(getAllSellersDashboard());
    } catch (error) {
        console.error(error);
        toast.error(
            error?.response?.data?.message || 
            error?.response?.data?.password || 
            "Internal Server Error"
        );
    } finally {
        setLoader(false);
        setOpen(false);
    }
};

export const getUserOrders = (queryString) => async (dispatch) => {
    try {
        dispatch({ type:"IS_FETCHING" });
        const { data } = await api.get(`/user/orders?${queryString}`);
        dispatch({
            type: "GET_USER_ORDERS",
            payload: data.content, 
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage
        });
        dispatch({ type:"IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type:"IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch orders data",
        });
    }
};