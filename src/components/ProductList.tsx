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

const sortOptions =  [
      "Name (Ascending)",
      "Name (Descending)",
      "Price (Ascending)",
      "Price (Descending)",
      "No sorting",
    ];

const cardsPerPage =  9;

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "All products";
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [sortedProducts, setSortedProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [sortBy, setSortBy] = useState("No sorting");
  const [pageFirst, setPageFirst] = useState(0);
  const [priceSliderValue, setPriceSliderValue] = useState([0, 0]);
  const [productMinMax, setproductMinMax] = useState([0, 0]);
  const [inStockFilter, setInStockFilter] = useState(false);

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
        setFilteredProducts(prodArray);
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

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    console.log(sort);
    let sortedProducts: ProductProps[] = [];
    if (sort === sortOptions[0]) {
      sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === sortOptions[1]) {
      sortedProducts = [...products].sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sort === sortOptions[2]) {
      sortedProducts = [...products].sort((a, b) => {
        const aPrice: number = a.discountPrice || a.price
        const bPrice: number = b.discountPrice || b.price
        return aPrice - bPrice;
      });
    }
    if (sort === sortOptions[3]) {
      sortedProducts = [...products].sort((a, b) => {
        const aPrice: number = a.discountPrice || a.price
        const bPrice: number = b.discountPrice || b.price
        return bPrice - aPrice;
      });
    }
    if (sort === sortOptions[4]) {
      sortedProducts = [...products]
    }
    setSortedProducts(sortedProducts);
    setPageFirst(0);
  };

  useEffect(() => {
    applyFilters()
  }, [sortedProducts]);

  const pageProducts = useMemo(
    () => filteredProducts.slice(pageFirst, pageFirst + cardsPerPage),
    [pageFirst, cardsPerPage, filteredProducts],
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

  const applyFilters = () => {
    console.log("Stock filter:",inStockFilter)
    console.log("Price Min:",priceSliderValue[0])
    console.log("Price Max:",priceSliderValue[1])
    const filteredProducts = sortedProducts.filter((product) => {
      if (inStockFilter && !product.inStock) {
        return false;
      }

      const price = product.discountPrice || product.price;
      return price >= priceSliderValue[0] && price <= priceSliderValue[1];
    });

    setFilteredProducts(filteredProducts);
  }

  const resetFilters = () => {
    setInStockFilter(false);
    setPriceSliderValue([productMinMax[0], productMinMax[1]]);
    setFilteredProducts(sortedProducts)
  }

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
                <Checkbox checked={inStockFilter} onChange={() => setInStockFilter(!inStockFilter)} inputId="stock-filter"></Checkbox>
                <label htmlFor="stock-filter">In stock</label>
              </div>
              <div className="flex flex-row justify-content-center gap-3 mb-4">
                <Button onClick={applyFilters}>Apply filters</Button>
                <Button onClick={resetFilters} outlined >Reset filters</Button>
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
              onChange={(e) => handleSortChange(e.value)}
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
            rows={cardsPerPage}
            totalRecords={filteredProducts.length}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};

export default ProductList;
