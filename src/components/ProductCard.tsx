import { Card } from "primereact/card";
import React from "react";
import { BASE_URL } from "../services/ApiService.ts";
import styles from "./ProductCard.module.css";
import "./ProductCard.override.css";
import { Link } from "react-router-dom";

export interface ProductProps {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
  price: number;
  rating: number;
  discountPrice?: number;
  discountPercent?: number;
}

export interface ProductCardProps {
  product: ProductProps;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getStars = () => {
    const intRating = Math.trunc(product.rating);
    const starsArr = [];
    for (let i = 0; i < intRating; i++) {
      starsArr.push(<i key={`star-full-${i}`} className="bi bi-star-fill"></i>);
    }
    if (product.rating - intRating > 0) {
      starsArr.push(<i key={`star-half`} className="bi bi-star-half"></i>);
    }
    for (let i = starsArr.length; i < 5; i++) {
      starsArr.push(<i key={`star-empty-${i}`} className="bi bi-star"></i>);
    }

    return starsArr;
  };

  return (
    <>
      <div className="productCard col-4 p-3">
        <Link to={`/products/${product.id}`}>
          <Card>
            <div
              className={`flex flex-column align-items-center gap-2 ${styles.cardContent}`}
            >
              <div className="relative">
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
              <span className={`${styles.productName} productName`}>{product.name}</span>
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
                    <span className={`${styles.originalPrice}`}>{product.price.toFixed(2)} €</span>
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
              <div
                className={`flex flex-row align-items-center gap-3 ${styles.rating}`}
              >
                {product.rating && (
                  <>
                    Avaliação:
                    <span>{getStars()}</span>
                    {product.rating} / 5
                  </>
                )}
                {!product.rating && <span>Sem avaliações.</span>}
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </>
  );
};

export default ProductCard;
