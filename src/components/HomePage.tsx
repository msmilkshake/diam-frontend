import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import ProductCard, { ProductProps } from "./ProductCard.tsx";
import ApiService, { BASE_URL } from "../services/ApiService.ts";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import styles from "./ProductCard.module.css";

const HomePage = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);

  const getProducts = async () => {
    const response = (await ApiService.get("/discounts")) as ProductProps[];
    setProducts(response);
    console.log(products);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const responsiveOptions: CarouselResponsiveOption[] = [
      {
          breakpoint: "2500px",
          numVisible: 4,
          numScroll: 1,
      },
      {
          breakpoint: "1900px",
          numVisible: 3,
          numScroll: 1,
      },
    {
      breakpoint: "1400px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "800px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const productTemplate = (product: ProductProps) => {
    return (
      <>
        <div className="productCard p-0 m-5 w-20 mt-3">
          <Link to={`/products/${product.id}`}>
            <Card>
              <div
                className={`flex flex-column align-items-center gap-2 ${styles.cardContent}`}
              >
                <div className="w-fit relative">
                  {product.discountPercent && (
                    <div className={`absolute ${styles.floatDiscount} p-3`}>
                      {product.discountPercent} %
                    </div>
                  )}
                  <img
                    className={`${styles.cardImage}`}
                    src={`${BASE_URL}/${product.imageUrl}`}
                    alt=""
                  />
                </div>
                <span className={`${styles.productName} productName`}>
                  {product.name}
                </span>
                <span className={`${styles.overflowDescription} text-justify`}>
                  {product.description}
                </span>
                <div className="flex flex-row justify-content-between align-items-end w-full">
                  <div>
                    {product.inStock && (
                      <span className={`${styles.inStock}`}>
                        <i className="bi bi-check-circle-fill"></i>
                        {" Em stock"}
                      </span>
                    )}
                    {!product.inStock && (
                      <span className={`${styles.outOfStock}`}>
                        <i className="bi bi-x-circle-fill"></i>
                        {" Sem stock"}
                      </span>
                    )}
                  </div>
                  <div
                    className={`flex flex-column justify-content-end align-items-end ${styles.priceContainer}`}
                  >
                    {product.discountPrice && (
                      <span className={`${styles.originalPrice}`}>
                        {product.price.toFixed(2)} €
                      </span>
                    )}
                    <span className={`${styles.price}`}>
                      Preço:{" "}
                      <span className={`${styles.price} ${styles.val}`}>
                        {product.discountPrice
                          ? product.discountPrice.toFixed(2)
                          : product.price.toFixed(2)}{" "}
                        €
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </>
    );
  };

  return (
    <>
        <h1 className="mb-0 pb-0">Produtos com desconto</h1>
      <Carousel
        verticalViewPortHeight="150px"
        value={products}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={productTemplate}
        circular
      />
      HomePage works! :)
    </>
  );
};

export default HomePage;
