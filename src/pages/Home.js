import React from "react";
import ProductsCategories from "../components/ProductsCategories";
import PageLayout from "../components/designLayouts/PageLayout";

export default function Home(props) {
  return (
    <>
      <PageLayout showFooter={true}>
        <ProductsCategories />
      </PageLayout>
    </>
  );
}
