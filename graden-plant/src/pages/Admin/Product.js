import { Button, Table, message } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { EditProduct, GetProducts, UpdateProductStatus } from '../../apicalls/products';
import { SetLoader } from '../../redux/loadersSlice';
import moment from "moment";

function Products() {

    const [products, setProducts] = React.useState([]);
    const dispatch = useDispatch();


    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProducts(null);
            dispatch(SetLoader(false));
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };
    const onStatusUpdate = async (id, status) => { 
        try {
            dispatch(SetLoader(true));
            const response = await UpdateProductStatus(id, status);
            dispatch(SetLoader(false));
            if(response.success){
                message.success(response.message);
                getData();
            }else{
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };
    const columns = [
        {
            title: "Product",
            dataIndex: "name",
        },
        {
            title: "Seller",
            dataIndex: "name",
            render: (text, record) => {
                return record.seller.name
            },
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Price",
            dataIndex: "price",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Age",
            dataIndex: "age",
        },
        {
            title: "Status",
            dataIndex: "status",
            render : (text, record) => {
                return record.status.toUpperCase();
            }
        },
        {
            title: "Added On",
            dataIndex: "createAt",
            render: (text, record) => moment(record.createdAt).format("DD-MM-YYYY hh:mm: A"),
        },
        
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => {
                const { status, _id } = record
                return (
                    <div className="flex gap-3">
                        {status === "pending" && (<span className='underline cursor-pointer'
                            onClick={() => onStatusUpdate(_id, "approved")}
                        >Approve</span>
                        )}
                        {status === "pending" && (
                            <span
                                className='underline cursor-pointer'
                                onClick={() => onStatusUpdate(_id, "rejected")}
                            >
                                Reject
                            </span>
                        )}
                        {status === "approved" && (
                            <span
                            className='underline cursor-pointer'
                            onClick={() => onStatusUpdate(_id, "blocked")}
                            >
                                Block
                            </span>
                        )}
                        {status === "blocked" && (
                            <span
                            className='underline cursor-pointer'
                            onClick={() => onStatusUpdate(_id, "approved")}
                            >
                                Unblock
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];


    useEffect(() => {
        getData();
    }, []);
    return (
        <div>

            <Table columns={columns} dataSource={products} />

        </div>
    );
}

export default Products;
