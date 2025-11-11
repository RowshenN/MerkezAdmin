import React, { useEffect, useRef, useState } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import PageLoading from "../../components/PageLoading";
import { useHistory, useParams } from "react-router-dom";
import { message } from "antd";
import Select from "@mui/joy/Select";
import Switch from "@mui/joy/Switch";
import Option from "@mui/joy/Option";

import { useGetCategoryTreeQuery } from "../../services/category";
import { useGetAttributesByCategoryQuery } from "../../services/attribute";
import { useGetBrandsQuery } from "../../services/brand";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../services/product";
import { useGetAllShopsQuery } from "../../services/shop";

const ProductUpdate = () => {
  const { id } = useParams();
  const history = useHistory();
  const imgRef = useRef(null);
  const galleryRef = useRef(null);
  const [warning, setWarning] = useState(false);

  const [product, setProduct] = useState({
    shopId: null,
    name: "",
    productCode: "",
    description: "",
    price: "",
    oldPrice: "",
    discount: 0,
    stockAmount: 0,
    categoryId: null,
    brandId: null,
    image: null,
    images: [],
    attributes: {},
    isActive: true,
  });

  const { data: productData, isLoading: productLoading } =
    useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const { data: categoryTree } = useGetCategoryTreeQuery();
  const { data: allBrands } = useGetBrandsQuery();
  const { data: allShops } = useGetAllShopsQuery();

  const [level3Categories, setLevel3Categories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ Fetch attributes dynamically when category changes
  const { data: categoryAttributes, refetch: refetchAttributes } =
    useGetAttributesByCategoryQuery(product.categoryId, {
      skip: !product.categoryId,
    });

  // Flatten level 3 categories
  useEffect(() => {
    if (!categoryTree) return;
    const flattenLevel3 = [];
    categoryTree.forEach((lvl1) => {
      lvl1.children?.forEach((lvl2) => {
        lvl2.children?.forEach((lvl3) => flattenLevel3.push(lvl3));
      });
    });
    setLevel3Categories(flattenLevel3);
  }, [categoryTree]);

  // Pre-fill product
  useEffect(() => {
    if (productData) {
      setProduct({
        shopId: productData.shopId || null,
        name: productData.name || "",
        productCode: productData.productCode || "",
        description: productData.description || "",
        price: productData.price || "",
        oldPrice: productData.oldPrice || "",
        discount: productData.discount || 0,
        stockAmount: productData.stockAmount || 0,
        categoryId: productData.categoryId || null,
        brandId: productData.brandId || null,
        image: productData.image || null,
        images: productData.images || [],
        isActive: productData.isActive || true,
        attributes:
          productData.productAttributes?.reduce((acc, attr) => {
            acc[attr.attributeId] = attr.value;
            return acc;
          }, {}) || {},
      });
      setPreviewImage(productData.image);
    }
  }, [productData]);

  // ✅ Refetch attributes whenever categoryId changes
  useEffect(() => {
    if (product.categoryId) {
      refetchAttributes();
    }
  }, [product.categoryId, refetchAttributes]);

  // Update handler
  const handleSubmit = async () => {
    try {
      const {
        name,
        productCode,
        description,
        price,
        oldPrice,
        discount,
        stockAmount,
        image,
        images,
        categoryId,
        brandId,
        attributes,
        shopId,
        isActive,
      } = product;

      if (!name || !productCode || !price || !categoryId || !brandId) {
        setWarning(true);
        return;
      }

      const formData = new FormData();
      if (shopId) formData.append("shopId", shopId);
      formData.append("name", name);
      formData.append("productCode", productCode);
      formData.append("description", description);
      formData.append("price", price);
      if (oldPrice) formData.append("oldPrice", oldPrice);
      if (discount) formData.append("discount", discount);
      formData.append("stockAmount", stockAmount);
      formData.append("categoryId", categoryId);
      formData.append("brandId", brandId);
      formData.append("isActive", isActive);

      if (image instanceof File) {
        formData.append("image", image);
      }

      if (images?.length > 0) {
        images.forEach((img) => {
          if (img instanceof File) formData.append("images", img);
        });
      }

      if (attributes && Object.keys(attributes).length > 0) {
        const parsedAttributes = Object.entries(attributes)
          .filter(([id, value]) => value != null && value !== "")
          .map(([id, value]) => ({
            attributeId: Number(id),
            value: value.toString(),
          }));

        if (parsedAttributes.length > 0) {
          formData.append("attributes", JSON.stringify(parsedAttributes));
        }
      }

      await updateProduct({ id, formData }).unwrap();
      message.success(" Product updated successfully!");
      history.goBack();
    } catch (err) {
      console.error("Submit error:", err);
      message.error(" Check your data!");
    }
  };

  if (productLoading) return <PageLoading />;

  return (
    <div className="w-full bg-white py-4 px-4">
      {warning && (
        <Alert
          className="!fixed z-50 top-5 right-5"
          sx={{ alignItems: "flex-start" }}
          startDecorator={<WarningIcon />}
          variant="soft"
          color="warning"
          endDecorator={
            <IconButton
              onClick={() => setWarning(false)}
              variant="soft"
              color="warning"
            >
              <CloseRoundedIcon />
            </IconButton>
          }
        >
          <div>
            <div>{"Please fill all required fields!"}</div>
            <Typography level="body-sm" color="warning">
              Fill all required fields before saving.
            </Typography>
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="w-full pb-3 border-b border-border flex items-center justify-start text-[20px] font-[600] text-text-prime">
        <div className="flex items-center justify-start gap-3">
          <div className="bg-blue w-1 h-5 rounded-full"></div>
          <p>Update Product</p>
        </div>
      </div>

      {/* Form */}
      <div className="w-full divide-y divide-border py-5">
        {/* Name */}
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Product Name</p>
          </div>
          <div className="w-[50%]">
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full py-2 px-3 outline-none border rounded-lg border-black/30"
            />
          </div>
        </div>

        {/* Product Code */}
        <div className="py-5 flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500]">
            <p>Product Code</p>
          </div>
          <div className="w-[50%]">
            <input
              type="text"
              value={product.productCode}
              onChange={(e) =>
                setProduct({ ...product, productCode: e.target.value })
              }
              className="w-full py-2 px-3 outline-none border rounded-lg border-black/30"
            />
          </div>
        </div>

        {/* Description */}
        <div className="py-5 flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500]">
            <p>Description</p>
          </div>
          <div className="w-[50%]">
            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full py-2 px-3 outline-none border rounded-lg border-black/30"
            />
          </div>
        </div>

        {/* Price */}
        <div className="py-5 flex items-start justify-between gap-5">
          <p className="text-text-prime w-[50%] text-[18px] font-[500]">
            Price
          </p>
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="w-[50%] py-2 px-3 outline-none border rounded-lg border-black/30"
          />
        </div>

        {/* Old Price */}
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Old Price</p>
          </div>
          <div className="w-[50%]">
            <input
              type="number"
              placeholder="Old Price"
              className="w-full py-2 px-3 outline-none text-text-prime text-base font-[400] border rounded-lg border-black/30"
              value={product.oldPrice}
              onChange={(e) =>
                setProduct({ ...product, oldPrice: e.target.value })
              }
            />
          </div>
        </div>

        {/* Discount */}
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Discount</p>
          </div>
          <div className="w-[50%]">
            <input
              type="number"
              placeholder="Discount"
              className="w-full py-2 px-3 outline-none text-text-prime text-base font-[400] border rounded-lg border-black/30"
              value={product.discount}
              onChange={(e) =>
                setProduct({ ...product, discount: e.target.value })
              }
            />
          </div>
        </div>

        {/* Stock */}
        <div className="py-5 flex items-start justify-between gap-5">
          <p className="text-text-prime w-[50%] text-[18px] font-[500]">
            Stock Amount
          </p>
          <input
            type="number"
            value={product.stockAmount}
            onChange={(e) =>
              setProduct({ ...product, stockAmount: e.target.value })
            }
            className="w-[50%] py-2 px-3 outline-none border rounded-lg border-black/30"
          />
        </div>

        {/* Shop */}
        {allShops && (
          <div className="py-5 flex items-start justify-between gap-5">
            <p className="w-[50%] text-[18px] font-[500]">Shop</p>
            <Select
              value={product.shopId || ""}
              onChange={(e, value) =>
                setProduct({ ...product, shopId: value?.props?.value })
              }
              className="w-[50%]"
            >
              {allShops.map((shop) => (
                <Option key={shop.id} value={shop.id}>
                  {shop.name}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {/* Category */}
        <div className="py-5 flex items-start justify-between gap-5">
          <p className="w-[50%] text-[18px] font-[500]">Category (Level 3)</p>
          <Select
            value={product.categoryId || ""}
            onChange={(event, value) => {
              const id =
                typeof value === "object" ? value?.props?.value : value;
              setProduct({ ...product, categoryId: id, attributes: {} });
            }}
            className="w-[50%]"
          >
            {level3Categories
              .filter((c) => c.isActive)
              .map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
          </Select>
        </div>

        {/* <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Category (Level 3)</p>
          </div>
          <div className="w-[50%]">
            <Select
              placeholder="Select Category"
              value={product.categoryId || ""}
              onChange={(event, value) => {
                const id =
                  typeof value === "object" ? value?.props?.value : value;
                setProduct({ ...product, categoryId: id, brandId: null });
              }}
            >
              {level3Categories
                .filter((c) => c.isActive)
                .map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
            </Select>
          </div>
        </div> */}

        {/* Brand */}
        <div className="py-5 flex items-start justify-between gap-5">
          <p className="w-[50%] text-[18px] font-[500]">Brand</p>
          <Select
            value={product.brandId || ""}
            onChange={(e, value) =>
              setProduct({ ...product, brandId: value?.props?.value })
            }
            className="w-[50%]"
          >
            {(Array.isArray(allBrands?.brands)
              ? allBrands.brands
              : allBrands || []
            )
              .filter((b) => b.isActive)
              .map((b) => (
                <Option key={b.id} value={b.id}>
                  {b.name}
                </Option>
              ))}
          </Select>
        </div>

        {/* Dynamic Attributes */}
        {categoryAttributes?.length > 0 &&
          categoryAttributes.map((attr) => (
            <div
              key={attr.id}
              className="py-5 flex items-start justify-between gap-5"
            >
              <p className="w-[50%] text-[18px] font-[500]">{attr.name}</p>
              <div className="w-[50%]">
                {attr.type === "select" ? (
                  <Select
                    value={product.attributes[attr.id] || ""}
                    onChange={(_, val) =>
                      setProduct((prev) => ({
                        ...prev,
                        attributes: { ...prev.attributes, [attr.id]: val },
                      }))
                    }
                  >
                    {attr.options?.map((opt) => (
                      <Option key={opt} value={opt}>
                        {opt}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <input
                    type={attr.type}
                    value={product.attributes[attr.id] || ""}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        attributes: {
                          ...prev.attributes,
                          [attr.id]: e.target.value,
                        },
                      }))
                    }
                    className="w-full py-2 px-3 outline-none border rounded-lg border-black/30"
                  />
                )}
              </div>
            </div>
          ))}

        {/* Main Image */}
        <div className="py-5 flex items-start justify-between gap-5">
          <p className="w-[50%] text-[18px] font-[500]">Main Image</p>
          <div className="w-[50%] flex gap-5 flex-wrap">
            {previewImage && (
              <div className="relative w-[75px] h-[75px]">
                <img
                  src={
                    product.image instanceof File
                      ? URL.createObjectURL(product.image)
                      : `${process.env.REACT_APP_BASE_URL}${product.image}`
                  }
                  alt="main"
                  className="w-[75px] h-[75px] object-cover rounded-[6px]"
                />
                <div
                  onClick={() => setProduct({ ...product, image: null })}
                  className="absolute -top-2 -right-2 cursor-pointer bg-slate-300 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </div>
              </div>
            )}
            {!product.image && (
              <div
                onClick={() => imgRef.current.click()}
                className="border-[2px] border-dashed border-[#98A2B2] px-5 py-3 text-2xl rounded-[6px] cursor-pointer"
              >
                +
              </div>
            )}
            <input
              ref={imgRef}
              type="file"
              className="hidden"
              onChange={(e) =>
                setProduct({ ...product, image: e.target.files[0] })
              }
            />
          </div>
        </div>

        {/* Gallery Images */}
        <div className="py-5 flex items-start justify-between gap-5">
          <p className="w-[50%] text-[18px] font-[500]">Gallery Images</p>
          <div className="w-[50%] flex gap-5 flex-wrap">
            {product.images.map((img, idx) => (
              <div key={idx} className="relative w-[75px] h-[75px]">
                <img
                  src={
                    img instanceof File
                      ? URL.createObjectURL(img)
                      : `${process.env.REACT_APP_BASE_URL}${img}`
                  }
                  alt={`img-${idx}`}
                  className="w-[75px] h-[75px] object-cover rounded-[6px]"
                />
                <div
                  onClick={() =>
                    setProduct({
                      ...product,
                      images: product.images.filter((_, i) => i !== idx),
                    })
                  }
                  className="absolute -top-2 -right-2 cursor-pointer bg-slate-300 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </div>
              </div>
            ))}
            <div
              onClick={() => galleryRef.current.click()}
              className="border-[2px] border-dashed border-[#98A2B2] px-5 py-3 text-2xl rounded-[6px] cursor-pointer"
            >
              +
            </div>
            <input
              ref={galleryRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) =>
                setProduct({
                  ...product,
                  images: [...product.images, ...Array.from(e.target.files)],
                })
              }
            />
          </div>
        </div>

        <div className="flex items-center border-t-[1px] justify-between py-[30px]">
          <div className="w-[380px]">
            <h1 className="text-[18px] font-[500]">Aktiw ýagdaýy</h1>
            <p className="text-[14px] mt-2 font-[500]">
              Harydyň aktiwligini saýlaň
            </p>
          </div>
          <div className="flex justify-start w-[550px]">
            <Switch
              checked={product.isActive}
              onChange={(event) =>
                setProduct({ ...product, isActive: event.target.checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full mt-4 flex justify-end gap-5 items-center bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
        <button
          onClick={() => history.goBack()}
          className="text-[14px] font-[500] py-[11px] px-[27px] hover:bg-red/70 bg-red text-white rounded-[8px]"
        >
          Goýbolsun et
        </button>
        <button
          onClick={handleSubmit}
          disabled={updating}
          className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue hover:bg-blue/70 rounded-[8px]"
        >
          {updating ? "Işlenilýär" : "Ýatda sakla"}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductUpdate);
