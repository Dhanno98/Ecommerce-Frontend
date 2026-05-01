import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getAllSellersDashboard } from "../store/actions";

const useSellerFilter = () => {

};

export const useDashboardSellerFilter = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const params = new URLSearchParams();

        const currentPage = searchParams.get("page")
            ? Number(searchParams.get("page"))
            : 1;

        params.set("pageNumber", currentPage - 1);

        const queryString = params.toString();
        dispatch(getAllSellersDashboard(queryString));
        
    }, [dispatch, searchParams]);
};

export default useSellerFilter;