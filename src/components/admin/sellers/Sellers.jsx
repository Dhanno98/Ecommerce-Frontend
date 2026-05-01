import React, { useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa';
import { MdPersonAdd } from "react-icons/md";
import Loader from '../../shared/Loader';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '../../shared/Modal';
import AddSellerForm from './AddSellerForm';
import { useDashboardSellerFilter } from '../../../hooks/useSellerFilter';
import { adminSellerTableColumn } from '../../helper/tableColumn';

const Sellers = () => {
    // const sellers = [ { "userId": 3, "username": "admin", "email": "admin@example.com", "password": "$2a$10$wGhBI.R954ZAHXgAZYpKxe/CjM7mDOWffITqjFxauYgB23XUIV46S", "roles": [ { "roleId": 3, "roleName": "ROLE_ADMIN" }, { "roleId": 2, "roleName": "ROLE_SELLER" }, { "roleId": 1, "roleName": "ROLE_USER" } ], "address": null, "cart": { "cartId": 2, "products": [], "totalPrice": 0.0 } } ];

    const { sellers, pagination } = useSelector((state) => state.seller);
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const [currentPage, setCurrentPage] = useState(
      pagination?.pageNumber + 1 || 1
    );

    const [openAddModal, setOpenAddModal] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const pathname = useLocation().pathname;

    useDashboardSellerFilter();

    const tableRecords = sellers?.map((item) => {
      return {
        id: item.userId,
        userName: item.username,
        email: item.email,
      }
    });

    const handlePaginationChange = (paginationModel) => {
      const page = paginationModel.page + 1;
      setCurrentPage(page);
      params.set("page", page.toString());
      navigate(`${pathname}?${params}`);
    };

    const emptySeller = !sellers || sellers?.length === 0;

    return (
        <div>
          <div className='pt-6 pb-10 flex justify-end'>
            <button
              onClick={() => setOpenAddModal(true)}
              className='bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300'>
                <MdPersonAdd className='text-xl' />
                Add Seller
            </button>
          </div>

          {!emptySeller && (
            <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
              All Sellers
            </h1>
          )}
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {emptySeller ? (
                <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
                  <FaBoxOpen size={50} className='mb-3'/>
                  <h2 className='text-2xl font-semibold'>
                    No sellers created yet.
                  </h2>
                </div>
              ) : (
                <div className='max-w-full'>
                  <DataGrid 
                    className='w-full'
                    rows={tableRecords}
                    columns={adminSellerTableColumn()}
                    paginationMode='server'
                    rowCount={pagination?.totalElements || 0}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: pagination?.pageSize || 10,
                          page: currentPage - 1,
                        },
                      },
                    }}
                    onPaginationModelChange={handlePaginationChange}
                    disableRowSelectionOnClick
                    disableColumnResize
                    pageSizeOptions={[pagination?.pageSize || 10]}
                    pagination
                    paginationOptions={{
                      showFirstButton: true,
                      showLastButton: true,
                      hideNextButton: currentPage === pagination?.totalPages,
                    }}
                  />
                </div>
              )}
            </>
          )}

          <Modal
            open={openAddModal}
            setOpen={setOpenAddModal}
            title={'Add Seller'}
          >
            <AddSellerForm 
              setOpen={setOpenAddModal}
            />
          </Modal>

        </div>
    )
}

export default Sellers