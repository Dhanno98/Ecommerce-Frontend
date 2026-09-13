import axios from "axios";
import store from "../store/reducers/store";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
});

// Runs before every request
api.interceptors.request.use(
    (config) => {
        const auth = JSON.parse(localStorage.getItem("auth"));

        const isAuthEndpoint = 
        config.url === "/auth/signin" || 
        config.url === "/auth/signup" ||
        config.url === "/auth/refresh";

        if (auth?.jwtToken && !isAuthEndpoint) {
            config.headers.Authorization = `Bearer ${auth.jwtToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only handle 401 responses once
        if (error.response?.status === 401 &&
            !originalRequest?._retry &&
            !originalRequest?._skipAuthRefresh
        ) {
            originalRequest._retry = true;

            try {
                const auth = JSON.parse(localStorage.getItem("auth"));
                const refreshToken = auth?.refreshToken;

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const { data } = await api.post("/auth/refresh", { refreshToken }, { _skipAuthRefresh: true });

                const updatedAuth = {
                    ...auth, 
                    jwtToken: data.jwtToken,
                    refreshToken: data.refreshToken,
                };

                localStorage.setItem("auth", JSON.stringify(updatedAuth));

                store.dispatch({
                    type: "LOGIN_USER",
                    payload: updatedAuth,
                });

                originalRequest.headers.Authorization = `Bearer ${data.jwtToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem("auth");
                localStorage.removeItem("CHECKOUT_ADDRESS");
                localStorage.removeItem("client-secret");

                store.dispatch({
                    type: "LOG_OUT",
                });

                window.location.replace("/login");

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;