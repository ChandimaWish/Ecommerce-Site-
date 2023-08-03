import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SetLoader } from '../../redux/loadersSlice'
import { Button, message } from 'antd'
import { GetProductById, GetProducts } from '../../apicalls/products'
import { useNavigate, useParams } from 'react-router-dom'
import Divider from "../../components/Divider"
import moment from 'moment'


function ProductInfo() {
    const {user} = useSelector((state) => state.users);
   
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const [product, setProduct] = React.useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { id } = useParams();
    const getData = async () => {
        try {
            dispatch(SetLoader(true))
            const response = await GetProductById(id);
            dispatch(SetLoader(false));
            if (response.success) {
                setProduct(response.data);
            }
        } 
        catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };


    React.useEffect(() => {
        getData()
    }, [])
    return (
        product && <div>
            <div className='grid grid-cols-2 gap-5 mt-5'>
                {/* images */}
                <div className='flex flex-col gap-5'>
                    <img
                        src={product.images[selectedImageIndex]}
                        alt=''
                        className='w-full h-96 object-cover rounded-md'
                    />
                    <div className='flex gap-5'>
                        {product.images.map((image, index) => {
                            return (
                                <img className={'w-20 h-20 object-cover rounded-md cursor-pointer' +
                                    (selectedImageIndex === index
                                        ? "border-2 border-green-700 border-dashed p-2"
                                        : "")
                                }
                                    onClick={() => setSelectedImageIndex(index)}
                                    src={image}
                                    alt=''
                                />
                            )
                        })}
                    </div>
                    <Divider />
                    <div>
                        <h1 className='text-gray-600'>
                            Added on
                        </h1>
                        <span className='text-gray-600'>
                            {moment(product.createdAt).format("MMM D YYYY hh:mm A")}
                        </span>
                    </div>
                </div>
                {/* details*/}
                <div className='flex flex-col gap-3 '>
                    <div>
                        <h1 className='text-2xl font-semibold text-lime-700'> {product.name}</h1>
                        <span>
                            {product.description}
                        </span>
                    </div>
                    <Divider />
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-semibold text-lime-700'>Product Details</h1>
                        <div className='flex justify-between md-2'>
                            <span> Price </span>
                            <span> ${product.price} </span>
                        </div>
                        <div className='flex justify-between md-2'>
                            <span> Category </span>
                            <span className='uppercase'> {product.category} </span>
                        </div>
                        <div className='flex justify-between md-2'>
                            <span> Bill Availabale </span>
                            <span> {product.billAvailable ? "Yes" : "No"}</span>
                        </div>
                        <div className='flex justify-between md-2'>
                            <span> Box Availabale </span>
                            <span> {product.boxAvailable ? "Yes" : "No"}</span>
                        </div>
                        <div className='flex justify-between md-2'>
                            <span> Accessories Available </span>
                            <span> {product.accessoriesAvailable ? "Yes" : "No"}</span>
                        </div>
                        <div className='flex justify-between md-2'>
                            <span> Warrenty Available </span>
                            <span> {product.warrantyAvailable ? "Yes" : "No"}</span>
                        </div>
                        <div className='flex justify-between md-2'>
                            <span> Purchased Year </span>
                            <span>
                                {
                                    moment().subtract(product.age,'year').format("YYYY")}({product.age} years ago)
                                
                            </span>
                        </div>


                    </div>
                    <Divider />
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-semibold text-lime-700'>Seller Details</h1>
                        <div className='flex justify-between md-2'>
                            <span> Name </span>
                            <span> {product.seller.name} </span>
                        </div>
                        <div className='flex justify-between md-2'>
                            <span> Email </span>
                            <span > {product.seller.email} </span>
                        </div>



                    </div>
                    <Divider />
                    
                </div>
            </div>
           
        </div>
    )
}

export default ProductInfo
