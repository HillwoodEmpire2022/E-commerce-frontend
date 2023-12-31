import { FiHeart } from "react-icons/fi";
import SmallImagesContainer from "./SmallImagesContainer";
import { useState } from "react";
import Modal from "../../designLayouts/Modal";
import SignInForm from "../Authentication/SignInForm";
import SignUpForm from "../Authentication/SignUpForm";
import { useSelector } from "react-redux";

const ProductImages = (props) => {
    const [openModal, setOpenModal] = useState(false);
    const [openForm, setOpenForm] = useState({ signin: true, signup: false })
    

    const handleImageClick = (e) => {
        props.setCartItemInfo({
            ...props.cartItemInfo,
            imagePreview: e.target.src
        })
    }

    const handleAddingToWishlist = () => { 
        if (props.userInfo && Object.keys(props.userInfo.profile).length > 0) {
            //post to database wishlist and dispatch product to redux 
        } else { 
            return setOpenModal(true)
        }
    } 
    return (
        <>
            <div className="mt-4 inline-block w-container lg:w-[35%]">
                <div className="flex flex-col gap-3 items-center">
                    <div className="relative max-w-[428px] max-h-[418px] rounded-md">
                        <FiHeart
                            className="absolute right-2 top-2 bg-white hover:text-[#1D6F2B] hover:bg-[#E5E5E5] rounded-full py-1.5 px-2.5  cursor-pointer"
                            size={40}
                            onClick={handleAddingToWishlist}
                        />
                        
                        <img src={props.cartItemInfo.imagePreview} className="w-full rounded-md" />
                    </div> 
                    <div className="flex flex-row gap-1">
                        <img
                            className="w-[45px] h-[45px] border-[2px] rounded-lg cursor-pointer"
                            src={props.DBProductInfo.productImages.productThumbnail.url}
                            onClick={handleImageClick}
                        />
                        <SmallImagesContainer
                            imagesInfo={props.DBProductInfo.productImages.otherImages}
                            cartItemInfo={props.cartItemInfo}
                            setCartItemInfo={props.setCartItemInfo}
                            imageCategory={"other-images"}
                        />
                    </div>
                </div>
            </div>
            <Modal
                openModal={openModal}
                setOpenModal={setOpenModal}
                styles="p-0 mb-4 mdl:mx-7 lgl:mx-auto overflow-y-hidden"
            >   
                { openForm.signin === true ? <SignInForm setOpenForm={setOpenForm} />: ""}
                { openForm.signup === true ? <SignUpForm setOpenForm={setOpenForm}/>: ""}
                
            </Modal>
            
        </>
    )
}

export default ProductImages;
