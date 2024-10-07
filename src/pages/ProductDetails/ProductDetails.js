import React, { useState, useRef } from "react";
import ProductImages from "./ProductImages";
import ProductMainInfo from "./ProductMainInfo";
import CheckoutDetails from "./CheckoutDetails";
import ProductSecondaryInfo from "./ProductSecondaryInfo";
import { useDispatch } from "react-redux";
import { addTowishlist } from "../../redux/Reducers/wishlist";
import { removeTowishlist } from "../../redux/Reducers/wishlist";
import discountedFinalPrice from "../../util/discountedFinalPrice";
import { ProductSection } from "../../components/our-products/ProductSection";
export default function ProductDetails({ product, dispatch }) {
  const [sectionHasProducts, setSectionHasProducts] = useState({});

  const topDivRef = useRef(null);
  const scrollToTop = () => {
    if (topDivRef.current) {
      setTimeout(() => {
        topDivRef.current.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }
  };
  const handleAddwishlist = async (id) => {
    // event.stopPropagation();

    let productInfo = product.productDetails;

    let wishlist = JSON.parse(localStorage.getItem("wishlist"));

    if (!wishlist) {
      wishlist = [];
    }
    let existingProduct = wishlist.find((product) => product.id === id);

    if (!existingProduct) {
      existingProduct = {
        id: productInfo.id,
        name: productInfo.name,
        price: Math.trunc(
          await discountedFinalPrice(
            productInfo.price,
            productInfo.discountPercentage,
          ),
        ),
        productThumbnail: productInfo.productImages.productThumbnail,
        seller: productInfo.seller,
        discountPercentage: productInfo?.discountPercentage,
        items: 1,
        hasColors: productInfo.hasColors,
        hasMeasurements: productInfo.hasMeasurements,
      };
      wishlist.push(existingProduct);
    } else {
      // existingProduct.items += 0;
    }

    // Dispatch the addTowishlist action to update the Redux state
    dispatch(addTowishlist(existingProduct));

    // Update localStorage
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  const handleSectionProductStatus = (productClassId, hasProducts) => {
    setSectionHasProducts((prevState) => ({
      ...prevState,
      [productClassId]: hasProducts,
    }));
  };

  return (
    <div className="mx-auto w-full border-b-[1px] border-b-gray-300">
      <div className="mx-auto mt-10 max-w-container p-4">
        <div className="-mt-5 h-full w-full pb-10 xl:-mt-8">
          <div className="flex flex-col gap-14">
            <div
              ref={topDivRef}
              className="flex flex-col items-center gap-12 mdl:flex-row mdl:flex-wrap"
            >
              <>
                <ProductImages
                  productImages={product.productDetails.productImages}
                  activeImage={product.activeImage}
                  dispatch={dispatch}
                  productId={product.productDetails.id}
                  handleAddwishlist={handleAddwishlist}
                />
                <ProductMainInfo
                  product={product.productDetails}
                  dispatch={dispatch}
                  selectedMeasurement={product.selectedMeasurement}
                  selectedColor={product.selectedColor}
                  activeImage={product.activeImage}
                />
                <CheckoutDetails product={product} />

                <ProductSecondaryInfo product={product.productDetails} />
              </>
            </div>
          </div>

          <div
            onClick={scrollToTop}
            className="mx-auto mt-10 max-w-container space-y-4 px-2 md:px-6"
          >
            <h1 className="medium2_text my-6">Related Products</h1>
            <ProductSection
              // key={`${productClass.id}`}
              productClassId={product?.productDetails?.productClass}
              // category={product?.productDetails?.category}
              // setIsSectionHasProduct={(hasProducts) =>
              //   handleSectionProductStatus(
              //     product?.productDetails?.productClass,
              //     hasProducts
              //   )
              // }
            />
          </div>

          {/* For testing similar products slider only */}
          {/* <ProductsSection heading='Similar Products'>
            <ProductsSliderContainer>
              {similarProducts.length &&
                similarProducts.map((product) => {
                  return (
                    <div key={product._id} className='px-2'>
                      <ProductPreview productInfo={product} />
                    </div>
                  );
                })}
            </ProductsSliderContainer>
          </ProductsSection> */}
        </div>
      </div>
    </div>
  );
}
