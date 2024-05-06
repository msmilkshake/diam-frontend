import { useSearchParams } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "primereact/card";
import ProductCard, { ProductProps } from "./ProductCard.tsx";
import ApiService from "../services/ApiService.ts";
import { Dropdown } from "primereact/dropdown";
import styles from "./ProductList.module.css";
import "./ProductList.overrides.css"
import { Paginator } from "primereact/paginator";
import ProductFilter from "./ProductFilter.tsx";

const sortOptions = [
  "Nome (Ascendente)",
  "Nome (Descendente)",
  "Preço (Ascendente)",
  "Preço (Descendente)",
  "Nenhum",
];

const cardsPerPage = 9;

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "Todos os Produtos";
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [sortedProducts, setSortedProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [sortBy, setSortBy] = useState(sortOptions[4]);
  const [pageFirst, setPageFirst] = useState(0);
  const [priceSliderValue, setPriceSliderValue] = useState([0, 0]);
  const [productMinMax, setproductMinMax] = useState([0, 0]);
  const [inStockFilter, setInStockFilter] = useState(false);
  const [inSaleFilter, setInSaleFilter] = useState(false);

  const getProducts = async (type?: string) => {
    let url = "/products";
    if (type) {
      url += "?type=" + type;
    }
    return await ApiService.get(url);
  };

  useEffect(() => {
    setSortBy(sortOptions[4]);
    // console.log("effect");
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
    handleSortChange(sortOptions[4]);
  }, [products]);

  const handleSortChange = (sort) => {
    console.log(sort);
    let sortedProducts: ProductProps[] = [];
    if (sort === sortOptions[0]) {
      sortedProducts = [...products].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }
    if (sort === sortOptions[1]) {
      sortedProducts = [...products].sort((a, b) =>
        b.name.localeCompare(a.name),
      );
    }
    if (sort === sortOptions[2]) {
      sortedProducts = [...products].sort((a, b) => {
        const aPrice: number = a.discountPrice || a.price;
        const bPrice: number = b.discountPrice || b.price;
        return aPrice - bPrice;
      });
    }
    if (sort === sortOptions[3]) {
      sortedProducts = [...products].sort((a, b) => {
        const aPrice: number = a.discountPrice || a.price;
        const bPrice: number = b.discountPrice || b.price;
        return bPrice - aPrice;
      });
    }
    if (sort === sortOptions[4]) {
      sortedProducts = [...products];
    }
    console.log("Applying sorted products:", sortedProducts);
    setSortedProducts(sortedProducts);
    setPageFirst(0);
  };

  useEffect(() => {
    console.log("Applying filters", filteredProducts);
    applyFilters();
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
    console.log("Stock filter:", inStockFilter);
    console.log("Price Min:", priceSliderValue[0]);
    console.log("Price Max:", priceSliderValue[1]);
    const filteredProducts = sortedProducts.filter((product) => {
      if (inStockFilter && !product.inStock) {
        return false;
      }
      if (inSaleFilter && !product.discountPrice) {
        return false;
      }

      const price = product.discountPrice || product.price;
      return price >= priceSliderValue[0] && price <= priceSliderValue[1];
    });

    setFilteredProducts(filteredProducts);
  };

  const resetFilters = () => {
    setInStockFilter(false);
    setPriceSliderValue([productMinMax[0], productMinMax[1]]);
    setFilteredProducts(sortedProducts);
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
          <Card className={`ml-4 sticky ${styles.listFilter}`}>
            <ProductFilter
              priceSliderValue={priceSliderValue}
              productMinMax={productMinMax}
              onSliderChange={(e) => onSliderChange(e.value)}
              inStockFilter={inStockFilter}
              inSaleFilter={inSaleFilter}
              onStockCheck={() => setInStockFilter(!inStockFilter)}
              onSaleCheck={() => setInSaleFilter(!inSaleFilter)}
              onApplyFilterClick={applyFilters}
              onResetFilterClick={resetFilters}
            />
          </Card>
        </div>
        <div className="col-9">
          <div className="flex flex-row justify-content-start align-items-center mx-4 gap-3 productList">
            <span>Ordenar por:</span>
            <Dropdown
              options={sortOptions}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.value);
                handleSortChange(e.value);
              }}
            ></Dropdown>
          </div>
          <div className={`grid m-2 ${styles.cardItem}`}>
            {pageProducts.map((product: ProductProps) => (
              <ProductCard key={`prod-id-${product.id}`} product={product}/>
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
