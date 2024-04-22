import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "../../../components/designLayouts/PageLayout";
import { fetchCategories } from "../../../components/homePageCategories/HomePageCategories.js";
import ProductBanner from "../../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../../components/pageProps/shopPage/ShopSideNav";
import ShopProducts from "./ShopProducts.js";
import MobileCategoryNav from "../../../components/MobileCategoryNav.js";
import Paginator from "../../../components/Paginator.js";
import { Loader } from "../../../dashboard/Components/Loader/LoadingSpin.jsx";
import axios from "axios";

export async function fetchProducts(page, queryString) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_SERVER_URL}/api/v1/products?${queryString}&limit=10&page=${page}&fields=name,price,discountPercentage,productImages.productThumbnail.url`
    );

    return response.data.data.products;
  } catch (error) {
    return [];
  }
}

const Shop = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  const categoryId = searchParams.get("category");
  const subcategoryId = searchParams.get("subcategory");
  const [showfilter, setShowFilter] = React.useState(false);

  const queryString = query && `${query}`;

  const { data, isFetching, isLoading, hasNextPage, error, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [`products-${queryString}`],
      queryFn: ({ pageParam = 1 }) => {
        return fetchProducts(pageParam, queryString);
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    });

  const products = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page];
    }, []);
  }, [data]);

  const handlefilterShow = () => {
    setShowFilter(!showfilter);
  };

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const category =
    categoryId && categories
      ? categories.find((cat) => cat.id === categoryId)
      : null;

  const subcategory =
    subcategoryId && category
      ? category.subCategories.find((subCat) => subCat.id === subcategoryId)
      : null;

  return (
    <PageLayout showFooter={true}>
      <MobileCategoryNav title="Categories" />
      <div className="max-w-container mx-auto px-4 mt-5">
        {/* <Breadcrumbs title='Products' /> */}
        <div className="relative w-full h-full flex pb-20 gap-10">
          {/* <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
            <ShopSideNav brands={category && category.brands} />
          </div> */}

          {/* {showfilter && (
            <div className='w-[200px] lgl:w-[25%] bg-[white]  opacity-100    absolute mdl:relative mdl:hidden z-10 mdl:z-0 left-0 top-0  h-full'>
              <ShopSideNav
                brands={category && category.brands}
                handlefilterShow={handlefilterShow}
              />
            </div>
          )} */}
          <div className="w-[200px] lgl:w-[25%] bg-[white]  hidden mdl:block z-10 mdl:z-0   h-full">
            <ShopSideNav brands={category && category.brands} />
          </div>
          <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
            <ProductBanner handlefilterShow={handlefilterShow} />
            {(isLoading && (
              <div className="flex justify-center">
                <Loader fontSize={38} />
              </div>
            )) || (
              <ShopProducts
                products={products}
                category={category}
                subcategory={subcategory}
              />
            )}

            {error && <span>{error?.message}</span>}

            <Paginator
              isFetching={isFetching}
              isLoading={isLoading}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Shop;
