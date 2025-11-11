import React, { useEffect, useRef, useState } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import PageLoading from "../../components/PageLoading";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
// import { KeyboardArrowDown } from "@mui/icons-material";

import { useGetCategoryTreeQuery } from "../../services/category";
import { useGetAttributesByCategoryQuery } from "../../services/attribute";
import { useGetBrandsQuery } from "../../services/brand";
import { useCreateProductMutation } from "../../services/product";
import { useGetAllShopsQuery } from "../../services/shop";

const ProductCreate = () => {
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
  });

  const [createProduct, { isLoading }] = useCreateProductMutation();

  const user = JSON.parse(localStorage.getItem("userData")) || {};
  const isSuperAdmin = user?.user.role === "superadmin";

  // Fetch categories
  const { data: categoryTree } = useGetCategoryTreeQuery();
  const [level3Categories, setLevel3Categories] = useState([]);

  const navigate = useHistory();

  // Fetch brands (all)
  const { data: allBrands } = useGetBrandsQuery();

  const { data: allShops } = useGetAllShopsQuery();

  // Fetch attributes by category
  const { data: categoryAttributes } = useGetAttributesByCategoryQuery(
    product.categoryId,
    {
      skip: !product.categoryId,
    }
  );

  // Flatten level 3 categories
  useEffect(() => {
    if (!categoryTree) return;
    const flattenLevel3 = [];
    categoryTree.forEach((lvl1) => {
      lvl1.children?.forEach((lvl2) => {
        lvl2.children?.forEach((lvl3) => {
          flattenLevel3.push(lvl3);
        });
      });
    });
    setLevel3Categories(flattenLevel3);
  }, [categoryTree]);

  // create function
  const handleSubmit = async () => {
    console.log("product:  ", product);
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
      } = product;

      // ✅ Validate required fields
      if (
        !name ||
        !productCode ||
        !price ||
        !categoryId ||
        !brandId ||
        !image
      ) {
        setWarning(true);
        return;
      }
      if (!shopId && isSuperAdmin) {
        setWarning(true);
        return;
      }

      // ✅ Prepare FormData
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

      // ✅ Main image
      formData.append("image", image);

      // ✅ Gallery images
      if (images.length > 0) {
        images.forEach((img) => formData.append("images", img));
      }

      // ✅ Attributes
      if (attributes && Object.keys(attributes).length > 0) {
        const parsedAttributes = Object.entries(attributes).map(
          ([id, value]) => ({
            attributeId: Number(id),
            value,
          })
        );
        formData.append("attributes", JSON.stringify(parsedAttributes));
      }

      // ✅ API call
      await createProduct(formData).unwrap();
      message.success("Product created successfully!");
      navigate.goBack();
    } catch (err) {
      console.error("Submit error:", err);
      message.error("Check your data!");
    }
  };

  if (isLoading) return <PageLoading />;

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
          <div className="bg-green w-1 h-5 rounded-full"></div>
          <p>Create Product</p>
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
              placeholder="Name"
              className="w-full py-2 px-3 outline-none text-text-prime text-base font-[400] border rounded-lg border-black/30"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
        </div>

        {/* Product Code */}
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Product Code</p>
          </div>
          <div className="w-[50%]">
            <input
              type="text"
              placeholder="Code"
              className="w-full py-2 px-3 outline-none text-text-prime text-base font-[400] border rounded-lg border-black/30"
              value={product.productCode}
              onChange={(e) =>
                setProduct({ ...product, productCode: e.target.value })
              }
            />
          </div>
        </div>

        {/* Description */}
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Description</p>
          </div>
          <div className="w-[50%]">
            <textarea
              placeholder="Description"
              className="w-full py-2 px-3 outline-none text-text-prime text-base font-[400] border rounded-lg border-black/30"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>
        </div>

        {/* Price */}
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Price</p>
          </div>
          <div className="w-[50%]">
            <input
              type="number"
              placeholder="Price"
              className="w-full py-2 px-3 outline-none text-text-prime text-base font-[400] border rounded-lg border-black/30"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </div>
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
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Stock Amount</p>
          </div>
          <div className="w-[50%]">
            <input
              type="number"
              placeholder="Stock"
              className="w-full py-2 px-3 outline-none text-text-prime text-base font-[400] border rounded-lg border-black/30"
              value={product.stockAmount}
              onChange={(e) =>
                setProduct({ ...product, stockAmount: e.target.value })
              }
            />
          </div>
        </div>

        {/* Shop (Superadmin only) */}
        {allShops && allShops.length > 0 && (
          <div className="py-5 w-full flex items-start justify-between gap-5">
            <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
              <p>Shop</p>
            </div>
            <div className="w-[50%]">
              <Select
                placeholder="Select Shop"
                value={product.shopId || ""}
                onChange={(event, value) => {
                  const id =
                    typeof value === "object" ? value?.props?.value : value;
                  setProduct({ ...product, shopId: id });
                }}
              >
                {allShops.map((shop) => (
                  <Option key={shop.id} value={shop.id}>
                    {shop.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {/* Category */}
        <div className="py-5 w-full flex items-start justify-between gap-5">
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
        </div>

        {/*Brand */}
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Brand</p>
          </div>
          <div className="w-[50%]">
            <Select
              placeholder="Select Brand"
              value={product.brandId || ""}
              onChange={(event, value) => {
                const id =
                  typeof value === "object" ? value?.props?.value : value;
                setProduct({ ...product, brandId: id });
              }}
            >
              {(Array.isArray(allBrands?.brands)
                ? allBrands.brands
                : Array.isArray(allBrands)
                ? allBrands
                : []
              )
                .filter((b) => b.isActive)
                .map((b) => (
                  <Option key={b.id} value={b.id}>
                    {b.name}
                  </Option>
                ))}
            </Select>
          </div>
        </div>

        {/* Dynamic Attributes */}
        {categoryAttributes?.length > 0 &&
          categoryAttributes.map((attr) => (
            <div
              key={attr.id}
              className="py-5 w-full flex items-start justify-between gap-5"
            >
              <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
                <p>{attr.name}</p>
              </div>
              <div className="w-[50%]">
                {attr.type === "select" ? (
                  <Select
                    placeholder={`Select ${attr.name}`}
                    value={product.attributes[attr.id] || ""}
                    onChange={(_, value) =>
                      setProduct({
                        ...product,
                        attributes: { ...product.attributes, [attr.id]: value },
                      })
                    }
                  >
                    {attr.options.map((opt) => (
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
                      setProduct({
                        ...product,
                        attributes: {
                          ...product.attributes,
                          [attr.id]: e.target.value,
                        },
                      })
                    }
                    className="w-full py-2 px-3 outline-none text-text-prime text-base font-[400] border rounded-lg border-black/30"
                  />
                )}
              </div>
            </div>
          ))}

        {/* Main Image */}
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Main Image</p>
          </div>
          <div className="w-[50%] flex gap-5 flex-wrap">
            {product.image && (
              <div className="relative w-[75px] h-[75px]">
                <img
                  src={URL.createObjectURL(product.image)}
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
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col">
            <p>Gallery Images</p>
          </div>
          <div className="w-[50%] flex gap-5 flex-wrap">
            {product.images.map((img, idx) => (
              <div key={idx} className="relative w-[75px] h-[75px]">
                <img
                  src={URL.createObjectURL(img)}
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
      </div>

      {/* Footer */}
      <div className="w-full mt-4 flex justify-end gap-5 items-center bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
        <button
          onClick={() => history.goBack()}
          className=" text-[14px] font-[500] py-[11px] px-[27px] hover:bg-red/70 bg-red text-white rounded-[8px]"
        >
          Goýbolsun et
        </button>
        <button
          onClick={handleSubmit}
          className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-green hover:bg-green/70 rounded-[8px] hover:bg-opacity-90"
        >
          Ýatda sakla
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductCreate);
