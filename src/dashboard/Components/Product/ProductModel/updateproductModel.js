import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  Space,
  Image,
  Checkbox,
} from "antd";
import "../style.css";
import {
  PlusOutlined,
  FileImageOutlined,
  CloseOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import ModalFooter from "../../Button/Modelfooter";
// deendencies to implement redux toolkit
import { useSelector, useDispatch } from "react-redux";

import { Loader } from "../../Loader/LoadingSpin";
import { fetchCompany } from "../../../Apis/Company";
import { createProduct } from "../../../Apis/Product";
import { fetchCategory, fetchSubCategory } from "../../../Apis/Categories";
import Cookies, { set } from "js-cookie";
import { data } from "autoprefixer";
import { useRef } from "react";
import Item from "antd/lib/list/Item";
import Alerts from "../../Notifications&Alert/Alert";
import { useUser } from "../../../../context/UserContex";
// widget upload for cloudinary Image"
import UploadWidget from "../../../../components/CLOUDIMAGES/UploadWidget";
import { colorOptions } from "../../../../common/productpossibleColors";
import { sizeOptions } from "../../../../common/productspossibleSizes";
import { updateProduct } from "../../../Apis/Product";
import { fetchProduct } from "../../../../APIs/Product";

import { updateuserProduct } from "../../../Redux/ReduxSlice/Slice";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};

const UpdateProductModel = (props) => {
  const formRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [price, setPrice] = useState("");
  // checking state
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  // error handling states
  const [errProdCategory, setErrProdCategory] = useState("");
  const [errPrice, setErrPrice] = useState();

  const [alertIndex, setAlertIndex] = useState(null);
  const [alertIndexonUpdate, setAlertIndexonUpdate] = useState(null);

  const [alertDescription, setAlertDescription] = useState("");
  const [alertDescriptiononUpdate, setAlertDescriptiononUpdate] = useState("");
  const [isupdate, setIsupdate] = useState(false);
  const { user, onLogout } = useUser();
  const userRole = user?.role;

  const [addnew, setAddnew] = useState(false);
  const [addnewsub, setAddnewsub] = useState(false);
  const [companys, setCompanys] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [productClasses, setProductClasses] = useState([]);
  const [productBrands, setProductBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProductClass, setSelectedProductClass] = useState("");
  const [selectedProductBrand, setSelectedProductBrand] = useState("");
  const token = Cookies.get("token");

  // ahndel ulpad images on frontend
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [otherImageUrls, setOtherImageUrls] = useState([]);
  const [imageError, setImageError] = useState("");
  const [otherimagesError, setOtherimagesError] = useState("");
  const [colorImageUrls, setColorImageUrls] = useState("");
  // const [colorVariations, setColorVariations] = useState([]);

  // redux state handling
  const dispatch = useDispatch();
  const { product, load, err } = useSelector((state) => state.createproduct);

  const { company, loadcompany, errcompany } = useSelector(
    (state) => state.getcompany
  );

  const { categories, loadcategory, errcategory } = useSelector(
    (state) => state.category
  );
  const {
    dashproduct,
    loading: loadproduct,
    err: erroproduct,
  } = useSelector((state) => state.adminProduct);

  const { subcategories, loadsubcategory, errsubcategory } = useSelector(
    (state) => state.subcategory
  );
  const {
    loading: productclassLoading,
    productclass: productclassData,
    errorMessage: productclassError,
  } = useSelector((state) => state.productclass);
  const {
    loading: loadbrand,
    productbrand,
    errorMessage,
  } = useSelector((state) => state.productbrand);

  const [DBProductInfo, setDBProductInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(null);

  // Fetch Product
  useEffect(() => {
    async function getProduct() {
      try {
        const DBProductInfo = await fetchProduct(props.Id);
        setDBProductInfo(DBProductInfo);
      } catch (error) {
        // setErr(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    getProduct();
  }, [props.Id]);

  const [otherImages, setOtherImages] = React.useState([]);
  const [colorNames, setColorNames] = React.useState([]);
  const [colorImages, setColorImages] = React.useState([]);
  const [availableSizes, setAvailableSizes] = React.useState([]);
  const [products, setProducts] = useState();
  const [error, setError] = React.useState([]);
  const [success, setSuccess] = React.useState("");
  const [fieldvalidation, setFieldValidation] = React.useState();
  const [colorVariations, setColorVariations] = useState([
    // Initial color variation object
    {
      colorName: null,
      availableSizes: null,
      stock: 0,
      colorImageUrl: null, // URL of the color image
    },
  ]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [stock, setStock] = useState([]);
  const [absordCustomerCharge, setAbsordCustomerCharge] = useState(false);
  const [absorbhovered, setAbsorbhovered] = useState(false);

  const [index, setIndex] = useState(-1); //index for  color and size variations
  // use react from hook
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // use mode to specify the event that triggers each input field
    mode: "onBlur",
    defaultValues: DBProductInfo,
  });

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  let stockQuantity = colorVariations.reduce((acc, variation) => {
    return acc + parseInt(variation.stock);
  }, 0);

  const handleSubmits = async (data) => {
    if (!mainImageUrl) {
      setImageError("Product main image is required");
      return;
    }

    // // Validate otherImageUrls
    // if (otherImageUrls.length === 0) {
    //   setOtherimagesError("At least one product image is required");
    //   return;
    // }

    setOtherimagesError("");
    setImageError("");

    // Convert stockQuantity to a number if it's not already
    const stockQty =
      stockQuantity !== 0 ? stockQuantity : parseInt(data.stockQuantity);

    const hasValidationError =
      colorVariations[0].availableSizes !== null ||
      colorVariations[0].stock !== 0
        ? colorVariations.some((variation) => {
            return (
              // !variation.availableSizes ||
              // !variation?.colorName ||
              // !variation.colorImageUrl ||
              // !variation.stock
              (!variation.availableSizes && !variation?.colorName) ||
              // !variation.colorImageUrl ||
              !variation.stock
            );
          })
        : false;

    const hasValidationError2 = colorVariations.some((variation) => {
      return (
        (!variation?.colorName && variation.colorImageUrl) ||
        (variation?.colorName && !variation.colorImageUrl)
      );
    });

    if (hasValidationError2) {
      alert(
        "Something went wrong on combination of colorname and color image please check "
      );
      return;
    }

    if (hasValidationError) {
      alert(
        "Something went wrong in combination of color or size with its corresponding color and stockQuantity"
      );
      return; // Don't proceed with the API call if there's a validation error
    }

    // const AllfieldValidation = () => {
    // Get the fields in the first index that contain a value
    const filledFields =
      colorVariations[0] &&
      Object?.keys(colorVariations[0])?.filter(
        (field) => colorVariations[0][field]
      );

    // Iterate over the rest of the indices
    for (let i = 1; i < colorVariations.length; i++) {
      // Get the fields in the current index that contain a value
      const currentIndexFilledFields = Object.keys(colorVariations[i]).filter(
        (field) => colorVariations[i][field]
      );
      // Check if the filled fields in the first index are also filled in the current index
      for (const field of filledFields) {
        if (!colorVariations[i][field]) {
          // If a field is not filled, show an alert and return

          alert(
            `The field ${field} must be filled in all indices if it is filled in the first index`
          );

          return;
        }
      }

      // Check if the current index contains any extra filled fields
      for (const field of currentIndexFilledFields) {
        if (!filledFields.includes(field)) {
          // If an extra filled field is found, show an alert and return

          alert(
            `Only the fields that are filled in the first index should be filled in the rest of the indices. The field ${field} should not be filled in line ${
              i + 1
            }`
          );

          return;
        }
      }
    }

    const payload = {
      name: data.name,
      // seller: userRole === "seller" ? user.id : data.seller,
      category: data.category,
      subcategory: data.subcategory,
      description: data.description,
      price: Number(data.price),
      brandName: data.brandName,
      stockQuantity: stockQty,
      discountPercentage: data.discountPercentage,
      seller_commission: absordCustomerCharge
        ? data.seller_commission / 100
        : DBProductInfo?.seller_commission && DBProductInfo?.seller_commission,
      quantityParameter: data.quantityParameter,
      absorbCustomerCharge: absordCustomerCharge,
      hasColors:
        colorVariations.length > 0 &&
        colorVariations.every((variation) => variation.colorImageUrl),

      hasMeasurements:
        colorVariations.length > 0 &&
        colorVariations.every((variation) => variation.availableSizes),
      productImages: {
        productThumbnail: {
          public_id: "Feli Technology Inv. Group/",
          url: mainImageUrl,
        },
        otherImages: otherImageUrls?.map((image) => ({
          public_id: "Feli Technology Inv. Group/",
          url: image,
        })),
      },

      colorMeasurementVariations: {
        measurementType: "size",

        variations: colorVariations.map((variation) => {
          const colorImg =
            "colorName" in variation && "colorImageUrl" in variation
              ? {
                  url: variation.colorImageUrl,
                  colorName: variation?.colorName,
                }
              : null;
          const measurementvalue =
            "availableSizes" in variation ? variation.availableSizes : null;

          return {
            measurementvalue: measurementvalue,
            colorImg: colorImg,
            colorMeasurementVariationQuantity: parseInt(variation.stock),
          };
        }),
      },
    };

    setLoading(true);

    dispatch(
      updateProduct({
        productData: payload,
        id: props.Id,
        token: token,
      })
    )
      .unwrap()
      .then((data) => {
        if (data && data?.status == "success") {
          // update get product state
          dispatch(updateuserProduct({ id: props.Id, payload }));
          setProducts(data?.product);
          setAlertIndex("success");
          setAlertDescription("Product Updated successfully");
          setLoading(false);
          setTimeout(() => {
            handleCancel();
          }, 3000);
        }
      })
      .catch((er) => {
        setAlertIndex("error"); // Display error alert on error
        setAlertDescription("Error: " + er.message);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // close alert window
  const handleAlertClose = () => {
    setAlertIndex(null);
  };

  const onErrors = (errors) => {};

  // handle add new category
  const handleOpenNewModel = () => {
    setAddnew(true);
    // setIsModalOpen(false);
  };
  const handleOpenNewSubModel = () => {
    setAddnewsub(true);
  };
  // cancel on addnew model
  const handleCancelOnAddNew = () => {
    setAddnew(false);
    setAddnewsub(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
    setAddnew(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const onChange = (value) => {};

  const onSearch = (value) => {};

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) => {
    if (!option || !option.label) {
      return false;
    }
    return option.label.toLowerCase().includes(input.toLowerCase());
  };

  const fileList = [];

  const selectOptions =
    companys &&
    companys?.map((comp) => ({
      value: comp?.user?.id,
      label: comp?.user?.firstName,
    }));

  const productclassSelect =
    productclassData &&
    productclassData?.map((productclass) => ({
      value: productclass.id,
      label: productclass.name,
    }));

  const selectedCategoryProductclass =
    productclassData &&
    categorys &&
    categorys
      .filter((cat) => cat.productClass == selectedProductClass)
      .map((cat) => cat);

  const categorySelect =
    categorys &&
    selectedCategoryProductclass?.map((cat) => ({
      value: cat?.id,
      label: cat?.name,
    }));

  const selectBrandOption =
    productbrand &&
    productbrand
      .filter((brand) => brand.productClass == selectedProductClass)
      .map((brand) => ({
        value: brand.id,
        label: brand.name,
      }));

  // const categorySelect =
  //   categorys &&
  //   categorys?.map((cat) => ({
  //     value: cat?.id,
  //     label: cat?.name,
  //   }));

  const selectedCategoryObj = categorys.find(
    (cat) => cat.id === selectedCategory
  );

  let subcategory;

  if (selectedCategoryObj?.subCategories) {
    subcategory =
      selectedCategoryObj &&
      selectedCategoryObj?.subCategories &&
      selectedCategoryObj?.subCategories.map((subcat) => ({
        value: subcat.id,
        label: subcat.name,
      }));
  }

  function beforeUpload(file) {
    const newImgs = [...otherImages, file];
    setOtherImages(newImgs);
    return false;
  }
  function uploadColorImage(file) {
    const newImgs = [...colorImages, file];
    setColorImages(newImgs);
    return false;
  }
  function handlebeforeThumbnail(file) {
    return false;
  }

  // implement redux
  useEffect(() => {
    if (loadcategory == true) {
      dispatch(fetchCategory(token))
        .unwrap()
        .then((data) => {
          if (data?.data && data.status == "sucess") {
            setCategorys(data?.data?.categories);
          }
        })
        .catch((error) => {});
    }
  }, [loadcategory, dispatch]);
  useEffect(() => {
    if (loadsubcategory == true) {
      dispatch(fetchSubCategory(token))
        .unwrap()
        .then((data) => {
          if (data.data && data.status == "success")
            setSubcategorys(data?.data?.subCategories);
        })
        .catch((error) => {});
    }
  }, [loadsubcategory, dispatch]);

  // Fetch products only when the component mounts
  useEffect(() => {
    if (!categorys.length) {
      dispatch(fetchCategory(token))
        .unwrap()
        .then((data) => {
          if (data?.data && data.status == "sucess") {
            setCategorys(data?.data?.categories);
          }
        })
        .catch((error) => {});
    }
    if (!subcategorys.length) {
      dispatch(fetchSubCategory(token))
        .unwrap()
        .then((data) => {
          if (data.data && data.status == "success")
            setSubcategorys(data?.data?.subCategories);
        })
        .catch((error) => {});
    }
  }, [dispatch, categorys, subcategorys, token]);

  // implement redux
  useEffect(() => {
    if (loadcompany == true) {
      dispatch(fetchCompany(token))
        .unwrap()
        .then((data) => {
          if (data?.data?.sellers) setCompanys(data?.data?.sellers);
        })
        .catch((error) => {});
    }
  }, [loadcompany, dispatch]);

  // Fetch products only when the component mounts
  useEffect(() => {
    if (!companys.length) {
      dispatch(fetchCompany(token))
        .unwrap()
        .then((data) => {
          if (data?.data?.sellers) setCompanys(data?.data?.sellers);
        })
        .catch((error) => {});
    }
  }, [dispatch, companys, token]);

  function handleOnUpload(error, result, widget) {
    if (error) {
      setImageError(error);
      widget.close({ quiet: true });
      return;
    }
    // Assuming the main product image URL is stored in the secure_url property of the result object
    setMainImageUrl(result?.info?.secure_url);
    setImageError("");
  }

  const fieldValidation = () => {
    // Get the fields in the first index that contain a value
    const filledFields =
      colorVariations[0] &&
      Object?.keys(colorVariations[0])?.filter(
        (field) => colorVariations[0][field]
      );

    // Iterate over the rest of the indices
    for (let i = 1; i < colorVariations.length; i++) {
      // Get the fields in the current index that contain a value
      const currentIndexFilledFields = Object.keys(colorVariations[i]).filter(
        (field) => colorVariations[i][field]
      );
      // Check if the filled fields in the first index are also filled in the current index
      for (const field of filledFields) {
        if (!colorVariations[i][field]) {
          // If a field is not filled, show an alert and return

          alert(
            `The field ${field} must be filled in all indices if it is filled in the first index`
          );

          return;
        }
      }

      // Check if the current index contains any extra filled fields
      for (const field of currentIndexFilledFields) {
        if (!filledFields.includes(field)) {
          // If an extra filled field is found, show an alert and return

          alert(
            `Only the fields that are filled in the first index should be filled in the rest of the indices. The field ${field} should not be filled in line ${
              i + 1
            }`
          );

          return;
        }
      }
    }
  };

  const handleColorChange = (index, field, value) => {
    setColorVariations((prevVariations) => {
      // Deep copy the array using slice()
      const updatedVariations = [...prevVariations.slice(0)];

      // Update the specific object at the given index
      updatedVariations[index] = {
        ...updatedVariations[index],
        [field]: value,
      };

      return updatedVariations;
    });

    if (field === "colorName")
      setSelectedColor((prevSelectedColor) => {
        const updatedSelectedColor = [...prevSelectedColor];
        updatedSelectedColor[index] = {
          ...updatedSelectedColor[index],
          color: value,
        };

        return updatedSelectedColor;
      });

    if (field === "stock")
      try {
        setStock((prevstock) => {
          const updatedStock = [...prevstock];
          updatedStock[index] = {
            ...updatedStock[index],
            stock: parseInt(value),
          };

          return updatedStock;
        });
      } catch (error) {}
  };

  function handleonuploadOtherImages(error, result, widget) {
    if (error) {
      setImageError(error);
      widget.close({ quiet: true });
      return;
    }
    setOtherImageUrls((prevUrls) => [...prevUrls, result?.info?.secure_url]);
  }

  let stockforproduct =
    stock.length > 0
      ? stock.reduce((acc, curr) => acc + curr?.stock, 0)
      : Object.keys(DBProductInfo).length !== 0 && DBProductInfo.stockQuantity;

  useEffect(() => {
    // Update form values if profileview changes

    if (Object.keys(DBProductInfo).length === 0) return;

    stockforproduct = DBProductInfo.stockQuantity;

    setMainImageUrl(DBProductInfo.productImages.productThumbnail.url);
    setOtherImageUrls(
      DBProductInfo?.productImages?.otherImages.map((image) => image.url)
    );
    setValue("name", DBProductInfo.name || "");
    setValue("price", DBProductInfo.price || "");

    setAbsordCustomerCharge(DBProductInfo?.absorbCustomerCharge);

    setValue("seller", DBProductInfo?.seller || "");
    setValue(
      "productThumbnail",
      DBProductInfo.productImages.productThumbnail.url || ""
    );

    setSelectedSubCategory(DBProductInfo?.subcategory);
    setSelectedCategory(DBProductInfo?.category);
    setSelectedProductClass(DBProductInfo.productClass);
    setSelectedProductBrand(DBProductInfo?.brand);
    setValue(
      "subcategory",
      DBProductInfo?.subCategory || selectedSubCategory || ""
    ); // ||
    setValue("category", DBProductInfo.category || "");
    setValue(
      "seller_commission",
      DBProductInfo?.seller_commission
        ? DBProductInfo?.seller_commission * 100
        : ""
    );
    setValue("absorbCustomerCharge", DBProductInfo?.absorbCustomerCharge);
    setValue("productClass", DBProductInfo.productClass || "");
    setValue("brand", DBProductInfo?.brand || selectedProductBrand || "");
    setValue("description", DBProductInfo.description);
    setValue("currency", DBProductInfo.currency || "");
    setValue("discountPercentage", DBProductInfo?.discountPercentage || 0);
    setValue("otherImages", DBProductInfo.productImages.otherImages || "");
    setValue("brandName", DBProductInfo.brandName || "");
    setValue("stockQuantity", DBProductInfo.stockQuantity || "");
    setValue("quantityParameter", DBProductInfo.quantityParameter || "");
    setValue("hasColors", DBProductInfo.hasColors || "");
    setValue("hasMeasurements", DBProductInfo.hasMeasurements || "");
    setValue("colorMeasurementVariations", {
      measurementType: "size",
      variations: colorVariations,
    });
    setColorVariations(
      DBProductInfo.colorMeasurementVariations?.variations?.map((variation) => {
        return {
          colorName: variation?.colorImg?.colorName,
          availableSizes: variation?.measurementvalue,
          stock:
            variation?.colorMeasurementVariationQuantity > 0
              ? variation?.colorMeasurementVariationQuantity
              : 0,
          colorImageUrl: variation?.colorImg?.url,
        };
      })
    );
  }, [DBProductInfo, setValue]);

  const handleAbsorbCustomerCharge = (e) => {
    if (e.target.checked) {
      setAbsordCustomerCharge(true);
    }

    e.target.checked === false && setAbsordCustomerCharge(false);
  };

  // console.log("DBProductInfo", DBProductInfo?.seller_commission);

  return (
    <>
      <Modal
        title="Update product"
        width="80rem"
        open={props.isModalOpen}
        closeIcon={
          <CloseOutlined onClick={props.handleclose} className="text-[red]" />
        }
      >
        {alertIndex !== null && (
          <Alerts
            type={alertIndex}
            description={alertDescription}
            onClose={handleAlertClose}
            className="w-[100%] md:w-[30%] opacity-100 fixed  top-0 right-5 transform-[translate(-50%,-50%)] h-[100px] z-[9999]"
          />
        )}
        <Form
          layout={"vertical"}
          onFinish={handleSubmit(handleSubmits, onErrors)}
        >
          <div
            className={` space-x-0 md:space-x-6   md:flex  ${
              alertIndex !== null ? " mt-5 " : ""
            } `}
          >
            <Col
              span={24}
              md={12}
              className={` mb-3 border border-[black] p-3 
                
               `}
            >
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Form.Item label="Product name">
                    <Input {...field} placeholder="Enter product name" />
                    <p className="text-[red]">{errors?.name?.message}</p>
                  </Form.Item>
                )}
              />

              <Controller
                control={control}
                rules={{}}
                name="description"
                render={({ field }) => (
                  <>
                    <CKEditor
                      editor={ClassicEditor}
                      data={field.value}
                      onReady={(editor) => {}}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        field.onChange(data); // Update the form field value
                      }}
                    />
                    <p className="text-[red]">
                      {errors?.description && errors.description.message}
                    </p>
                  </>
                )}
              />
            </Col>
            <Col
              span={24}
              md={11}
              className="border mb-3 border-[black] py-10 px-5 "
            >
              <div>
                <Controller
                  name="productClass"
                  control={control}
                  defaultValue={
                    Object.keys(DBProductInfo).length > 0
                      ? DBProductInfo.productClass
                      : ""
                  }
                  rules={{}}
                  render={({ field }) => (
                    <>
                      <Form.Item label="Product Class">
                        {productclassLoading ? (
                          <p>loading...</p>
                        ) : (
                          <Select
                            {...field}
                            showSearch
                            label="Text field"
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={productclassSelect}
                            onChange={(value) => {
                              field.onChange(value); // Update the form field value
                              setSelectedProductClass(value);
                              setSelectedCategory("");
                              setSelectedSubCategory("");
                              setSelectedProductBrand("");
                              setValue("category", "");
                              setValue("subcategory", "");
                              setValue("brand", "");
                            }}
                          />
                        )}

                        <p className="text-[red]">
                          {errors?.productClass?.message}
                        </p>
                      </Form.Item>
                    </>
                  )}
                />
              </div>
              <div className="">
                <Controller
                  name="category"
                  control={control}
                  defaultValue={
                    Object.keys(DBProductInfo).length > 0
                      ? DBProductInfo.category
                      : ""
                  }
                  rules={{}}
                  render={({ field }) => (
                    <>
                      <Form.Item label=" Category">
                        {loadcategory ? (
                          <p>loading...</p>
                        ) : (
                          <Select
                            {...field}
                            showSearch
                            value={field.value}
                            label="Text field"
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={categorySelect}
                            // update the selected category to get subcategories
                            onChange={(value) => {
                              field.onChange(value); // Update the form field value
                              setSelectedCategory(value); // Update the selected category
                              setSelectedSubCategory("");
                              setValue("subcategory", "");
                            }}
                          />
                        )}

                        <p className="text-[red]">
                          {errors?.category?.message}
                        </p>
                      </Form.Item>
                    </>
                  )}
                />
              </div>

              <div className="">
                <Controller
                  name="subcategory"
                  control={control}
                  defaultValue={
                    Object.keys(DBProductInfo).length > 0
                      ? DBProductInfo.subcategory
                      : ""
                  }
                  rules={{}}
                  render={({ field }) => (
                    <>
                      <Form.Item label={` Sub Category `} className="">
                        {loadcategory ? (
                          <p>loading...</p>
                        ) : (
                          <Select
                            {...field}
                            showSearch
                            value={field.value}
                            label="Text field"
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={subcategory?.length != 0 && subcategory}
                            onChange={(value) => {
                              field.onChange(value);
                              setSelectedSubCategory(value);
                              setValue("subcategory", value);
                            }}
                          />
                        )}

                        <p className="text-[red]">
                          {errors?.subcategory?.message}
                        </p>
                      </Form.Item>
                    </>
                  )}
                />
              </div>
            </Col>
          </div>

          <span className=" font-bold">Add Images</span>
          <div className="md:space-x-2  border  border-[black]  my-3 rounded  md:flex justify-between mt-3 p-3 ">
            <div className="w-full md:w-[40%] ">
              <span>Main product image</span>
              <p>Add product main image </p>
              <div className="flex flex-col justify-center items-center border rounded ">
                <>
                  <Form.Item
                    label=""
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    className=" text-center mt-2 "
                  >
                    <span className="">
                      Drop a main image here or click to upload.
                    </span>

                    <UploadWidget onUpload={handleOnUpload}>
                      {({ open }) => (
                        <Button
                          className=""
                          icon={<FileImageOutlined />}
                          onClick={open}
                        >
                          Upload
                        </Button>
                      )}
                    </UploadWidget>

                    {!mainImageUrl && (
                      <p className="text-[red]">{imageError}</p>
                    )}
                  </Form.Item>

                  <div className=" relative ">
                    {mainImageUrl && (
                      <>
                        <Image width={70} height={70} src={mainImageUrl} />
                        <MinusCircleOutlined
                          className="text-[red] text-xl absolute -top-3 font-bold -right-2"
                          onClick={() => {
                            setMainImageUrl("");
                          }}
                        />
                      </>
                    )}
                  </div>
                </>
              </div>
            </div>

            <div className=" w-full md:w-[65%] ">
              <span>Main product images</span>
              <p>Add product images </p>
              <div className="flex  flex-col justify-center items-center border rounded ">
                <Form.Item
                  label=""
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  className=" text-center mt-2   "
                >
                  <span className=" py-10 ">
                    Click to upload. maximum of 6 images
                  </span>

                  <br />

                  <UploadWidget
                    onUpload={handleonuploadOtherImages}
                    uploadmultiple={true}
                  >
                    {({ open }) => (
                      <Button
                        className=""
                        icon={<FileImageOutlined />}
                        onClick={open}
                      >
                        {/* <button className="" onClick={open}>
                              Upload
                            </button>{" "} */}
                        Upload
                      </Button>
                    )}
                  </UploadWidget>

                  {otherImageUrls.length == 0 && (
                    <p className="text-[red]">{otherimagesError}</p>
                  )}
                </Form.Item>
                <div className="flex justify-center border space-x-4">
                  {otherImageUrls.slice(0, 6).map((url, index) => {
                    return (
                      <div className=" relative" key={index}>
                        <Image
                          key={index}
                          width={70}
                          height={70}
                          src={url}
                          alt="otherimages"
                        />
                        <MinusCircleOutlined
                          className="text-[red] text-xl absolute -top-3 font-bold -right-2"
                          onClick={() => {
                            setOtherImageUrls(
                              otherImageUrls.filter((_, i) => i !== index)
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <span className="mt-2 font-bold ">
            Add Colors images here or Available Sizes
          </span>
          <div className="w-[100%] border  border-[black] my-3 p-3 rounded ">
            <span>
              Add a color or Size with it’s corresponding size and stockQuantity
            </span>
            <p>image </p>

            <div className="flex  w-[100%] p-5 flex-col justify-center  border   items-center rounded ">
              <Form.List name="colors">
                {(fields, { add, remove }) => (
                  <>
                    {colorVariations.length > 0 &&
                      colorVariations?.map((variation, index) => (
                        <Space
                          key={index}
                          style={{
                            display: "flex",
                            marginBottom: 2,
                          }}
                          align="baseline"
                        >
                          {variation?.colorName}
                          {/* Input for color name */}
                          <Form.Item
                            name={[index, "name"]}
                            label={
                              <div
                                style={{
                                  backgroundColor: variation?.colorName
                                    ? variation?.colorName
                                    : "",
                                }}
                                className={` w-20 h-5 border border-[black] rounded-full`}
                              ></div>
                            }
                          >
                            <div className="flex-col">
                              <Select
                                options={colorOptions}
                                value={variation?.colorName}
                                onChange={(value) =>
                                  handleColorChange(index, "colorName", value)
                                }
                                onSearch={onSearch}
                                showSearch
                              />
                            </div>
                          </Form.Item>
                          {/* Input for available sizes */}
                          <Form.Item
                            name={[index, "availableSizes"]}
                            label={`Available Sizes:  ${
                              variation?.availableSizes || ""
                            }`}
                          >
                            <Select
                              value={variation?.availableSizes}
                              options={sizeOptions}
                              onChange={(value) =>
                                handleColorChange(
                                  index,
                                  "availableSizes",
                                  value
                                )
                              }
                              onSearch={onSearch}
                              showSearch
                            />
                          </Form.Item>
                          {/* Input for number available in stock */}
                          {(variation?.colorName ||
                            variation?.availableSizes) && (
                            <input
                              placeholder="Enter Available Stock"
                              type="number"
                              value={variation?.stock}
                              onChange={(e) =>
                                handleColorChange(
                                  index,
                                  "stock",
                                  e.target.value
                                )
                              }
                            />
                          )}
                          <div className="flex flex-col">
                            <Form.Item>
                              {!variation?.colorImageUrl && (
                                <UploadWidget
                                  onUpload={(error, result, widget) => {
                                    if (error) {
                                      widget.close({
                                        quiet: true,
                                      });
                                      return;
                                    }
                                    handleColorChange(
                                      index,
                                      "colorImageUrl",
                                      result?.info?.secure_url
                                    );
                                  }}
                                  uploadmultiple={false}
                                >
                                  {({ open }) => (
                                    <Button
                                      type="primary"
                                      onClick={open}
                                      block
                                      icon={<PlusOutlined />}
                                    >
                                      Add Image
                                    </Button>
                                  )}
                                </UploadWidget>
                              )}
                              {variation?.colorImageUrl && (
                                <Image
                                  src={variation?.colorImageUrl}
                                  width={50}
                                  height={50}
                                />
                              )}
                            </Form.Item>
                          </div>
                          <MinusCircleOutlined
                            className="text-[red]"
                            onClick={() => {
                              remove(index);
                              const newVariations = [...colorVariations];
                              newVariations.splice(index, 1);
                              setColorVariations(newVariations);
                            }}
                          />
                        </Space>
                      ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                          setColorVariations([
                            ...colorVariations,
                            {
                              colorName: "",
                              availableSizes: "",
                              stock: "",
                            },
                          ]);
                        }}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </div>

          <span className="my-5 font-bold">More info</span>
          <div className="w-[100%] p-3 mt-3  border  border-[black] rounded">
            <div className="flex flex-wrap justify-start space-x-1 md:space-x-6 w-[100%]">
              {userRole == "seller" ? (
                <div className=" flex justify-center items-center ">{`Seller : ${
                  Object.keys(DBProductInfo).length > 0
                    ? DBProductInfo.seller.email
                    : ""
                }`}</div>
              ) : (
                <Controller
                  name="seller"
                  control={control}
                  defaultValue={
                    Object.keys(DBProductInfo).length > 0
                      ? DBProductInfo.seller.email
                      : ""
                  }
                  rules={{}}
                  render={({ field }) => (
                    <>
                      <Form.Item label="Select Seller" className=" w-[50%]">
                        {loadcompany ? (
                          <p>loading...</p>
                        ) : (
                          <Select
                            {...field}
                            showSearch
                            label="Text field"
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={selectOptions}
                          />
                        )}

                        <p className="text-[red]">{errors?.seller?.message}</p>
                      </Form.Item>
                    </>
                  )}
                />
              )}

              <Controller
                name="brand"
                control={control}
                defaultValue={
                  Object.keys(DBProductInfo).length > 0
                    ? DBProductInfo.brand
                    : ""
                }
                // rules={registerinput.brand}
                render={({ field }) => (
                  <>
                    <Form.Item label="Product brand" className="">
                      {loadbrand ? (
                        <p>loading...</p>
                      ) : (
                        <Select
                          {...field}
                          showSearch
                          label="Text field"
                          onSearch={onSearch}
                          filterOption={filterOption}
                          options={
                            selectBrandOption?.length != 0 && selectBrandOption
                          }
                        />
                      )}

                      <p className="text-[red]">{errors?.brand?.message}</p>
                    </Form.Item>
                  </>
                )}
              />

              {userRole == "admin" && (
                <>
                  {absordCustomerCharge && (
                    <Controller
                      name="seller_commission"
                      control={control}
                      rules={{}}
                      defaultValue={
                        Object.keys(DBProductInfo).length > 0 &&
                        DBProductInfo?.seller_commission
                          ? DBProductInfo.seller_commission * 100
                          : ""
                      }
                      render={({ field }) => (
                        <Form.Item label="Commission" className=" w-[30%]">
                          <InputNumber
                            className="w-full"
                            addonAfter="%"
                            placeholder="Enter seller commission"
                            name="seller_commission"
                            {...field}
                          />
                          <p className="text-[red]">{}</p>
                        </Form.Item>
                      )}
                    />
                  )}

                  <Controller
                    name="absorbCustomerCharge"
                    control={control}
                    defaultValue={
                      Object.keys(DBProductInfo).length > 0
                        ? DBProductInfo.absorbCustomerCharge
                        : false
                    }
                    rules={{}}
                    render={({ field }) => (
                      <>
                        <Form.Item label="CustomerCharge" className=" ">
                          <div
                            className="relative"
                            onMouseEnter={() => setAbsorbhovered(true)}
                            onMouseLeave={() => setAbsorbhovered(false)}
                          >
                            <Checkbox
                              {...field}
                              onChange={(e) => {
                                setAbsordCustomerCharge(!absordCustomerCharge);
                              }}
                              checked={absordCustomerCharge === true}
                            >
                              I agree to absorb customer charge.
                            </Checkbox>

                            {absorbhovered && (
                              <span className="absolute w-[180px] bg-primary text-white  rounded-md p-3  top-7 left-0 z-50">
                                Select this if you wish to cover the cost
                                charged to the customer for purchasing your
                                product.
                              </span>
                            )}
                          </div>

                          <p className="text-[red]">
                            {errors?.absorbCustomerCharge?.message}
                          </p>
                        </Form.Item>
                      </>
                    )}
                  />
                </>
              )}
            </div>

            <div className="grid grid-cols-2  md:flex justify-between  md:space-x-4">
              {stockQuantity !== 0 ? (
                <Form.Item
                  label={`stockQuantity:  ${stockforproduct} `}
                  className="md:w-[48%]"
                ></Form.Item>
              ) : (
                <Controller
                  name="stockQuantity"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <Form.Item label="stockQuantity" className="md:w-[48%]">
                      <Input
                        type="text"
                        placeholder="stockQuantity"
                        name="stockQuantity"
                        {...field}
                      />
                      <p className="text-[red]">
                        {errors?.stockQuantity?.message}
                      </p>
                    </Form.Item>
                  )}
                />
              )}
              <Controller
                name="price"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Form.Item label="Price" className="md:w-[48%]">
                    <InputNumber
                      className="w-full"
                      addonBefore="Rwf"
                      placeholder="amount"
                      name="price"
                      {...field}
                    />
                    <p className="text-[red]">{errors?.price?.message}</p>
                  </Form.Item>
                )}
              />

              <Controller
                name="discountPercentage"
                control={control}
                defaultValue={DBProductInfo?.discountPercentage || 0}
                rules={{}}
                render={({ field }) => (
                  <Form.Item label="Discount" className="md:w-[48%]">
                    <InputNumber
                      className="w-full"
                      addonBefore="%"
                      placeholder="discountPercentage"
                      name="discountPercentage"
                      {...field}
                    />
                    <p className="text-[red]">
                      {errors?.discountPercentage?.message}
                    </p>
                  </Form.Item>
                )}
              />
              <Controller
                name="quantityParameter"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Form.Item label="Quantity parameter" className="md:w-[48%]">
                    <Input
                      type="text"
                      placeholder="Enter quantityParameter"
                      name="quantityParameter"
                      {...field}
                    />

                    <p className="text-[red]">
                      {errors?.quantityParameter?.message}
                    </p>
                  </Form.Item>
                )}
              />
            </div>
          </div>
          <ModalFooter
            onCancel={props.handleclose}
            isload={load}
            loading={loading}
            // onOk={handleSubmitForm}
          />
        </Form>
      </Modal>
    </>
  );
};

export default UpdateProductModel;
