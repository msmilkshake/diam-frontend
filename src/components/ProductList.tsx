import { useSearchParams } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "primereact/card";
import ProductCard, { ProductProps } from "./ProductCard.tsx";
import ApiService from "../services/ApiService.ts";
import { Dropdown } from "primereact/dropdown";

import "./ProductList.css";
import { Paginator } from "primereact/paginator";
import { Slider } from "primereact/slider";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "All products";
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [sortedProducts, setSortedProducts] = useState<ProductProps[]>([]);
  const [sortBy, setSortBy] = useState("No sorting");
  const [pageFirst, setPageFirst] = useState(0);
  const [priceSliderValue, setPriceSliderValue] = useState([0, 0]);
  const [productMinMax, setproductMinMax] = useState([0, 0]);
  const [inStockFilter, setInStockFilter] = useState(false);

  const rows = useMemo(() => 9, []);

  const sortOptions = useMemo(
    () => [
      "Name (Ascending)",
      "Name (Descending)",
      "Price (Ascending)",
      "Price (Descending)",
      "No sorting",
    ],
    [],
  );

  const getProducts = async (type?: string) => {
    let url = "/products";
    if (type) {
      url += "?type=" + type;
    }
    return await ApiService.get(url);
  };

  useEffect(() => {
    console.log("effect");
    getProducts(type)
      .then((prodArray: ProductProps[]) => {
        setProducts(prodArray);
        setSortedProducts(prodArray);
      })
      .catch((error) => console.error(error));
  }, [type]);

  useEffect(() => {
    const prices = products.map(
      (product) => product.discountPrice || product.price,
    );

    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));

    setproductMinMax([minPrice, maxPrice]);
    setPriceSliderValue([minPrice, maxPrice]);
  }, [products]);

  const setSort = (sort: string) => {
    setSortBy(sort);
    console.log(sort);
    sort === "Name (Ascending)" &&
      setSortedProducts(
        [...products].sort((a, b) => a.name.localeCompare(b.name)),
      );
    sort === "Name (Descending)" &&
      setSortedProducts(
        [...products].sort((a, b) => b.name.localeCompare(a.name)),
      );
    sort === "Price (Ascending)" &&
      setSortedProducts([...products].sort((a, b) => a.price - b.price));
    sort === "Price (Descending)" &&
      setSortedProducts([...products].sort((a, b) => b.price - a.price));
    sort === "No sorting" && setSortedProducts(products);
    setPageFirst(0);
  };

  const pageProducts = useMemo(
    () => sortedProducts.slice(pageFirst, pageFirst + rows),
    [pageFirst, rows, sortedProducts],
  );

  const onPageChange = (event) => {
    setPageFirst(event.first);
  };

  const onSliderChange = (value: number | [number, number]) => {
    const [min, max] = value;
    if (min > max) {
      setPriceSliderValue([max, max]);
    } else {
      setPriceSliderValue([min, max]);
    }
  };

  return (
    <>
      <div className="grid">
        <div className="col-3"></div>
        <div className="col-9">
          <h1>{title}</h1>
        </div>
      </div>
      <div className="grid">
        <div className="col-3">
          <Card className="ml-4 sticky testclass">
            <div className="flex flex-column gap-6">
              <h4>Product Filters</h4>
              <div className="flex flex-column gap-4 align-items-center">
                <div className="flex flex-row justify-content-between w-full">
                  <span>Min: {priceSliderValue[0].toFixed(2)} €</span>
                  <span>Max: {priceSliderValue[1].toFixed(2)} €</span>
                </div>
                <Slider
                  style={{ width: "80%" }}
                  value={priceSliderValue}
                  min={productMinMax[0]}
                  max={productMinMax[1]}
                  step={1}
                  onChange={(e) => onSliderChange(e.value)}
                  // className="w-14rem"
                  range
                />
              </div>
              <div className="flex flex-row align-items-center justify-content-start gap-3 ml-4">
                <Checkbox inputId="stock-filter"></Checkbox>
                <label htmlFor="stock-filter">In stock</label>
              </div>
              <div className="mb-4">
                <Button>Apply filters</Button>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-9">
          <div className="flex flex-row justify-content-start align-items-center mx-4 gap-3">
            <span>Sort by:</span>
            <Dropdown
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSort(e.value)}
            ></Dropdown>
          </div>
          <div className="grid m-2">
            {pageProducts.map((product: ProductProps) => (
              <ProductCard key={`prod-id-${product.id}`} product={product} />
            ))}
          </div>
          <Paginator
            className="mx-4"
            first={pageFirst}
            rows={rows}
            totalRecords={sortedProducts.length}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};

export default ProductList;
