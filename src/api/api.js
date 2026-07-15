import axios from "axios";
import store from "../store/reducers/store";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
});

// Runs before every request
api.interceptors.request.use(
    (config) => {
        const auth = JSON.parse(localStorage.getItem("auth"));
        if (auth?.jwtToken) {
            config.headers.Authorization = `Bearer ${auth.jwtToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Runs before response
let loggingOut = false;
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401 && !loggingOut) {
            loggingOut = true;

            localStorage.removeItem("auth");
            localStorage.removeItem("CHECKOUT_ADDRESS");
            localStorage.removeItem("client-secret");

            store.dispatch({
                type:"LOG_OUT"
            });

            window.location.replace="/login";
        }
        return Promise.reject(error);
    }
);

export default api;