import { Card } from "primereact/card";
import React from "react";
import { BASE_URL } from "../services/ApiService.ts";
import "./ProductCard.css";
import "primeflex/primeflex.css";

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
      <div className="col-4 p-3">
        <Card>
          <div className="flex flex-column align-items-center gap-2 card-content">
            <div className="relative">
              {product.discountPercent &&
                <div className="absolute float-discount p-3">
                  {product.discountPercent} %
                </div>
              }
              <img
                className="card-image"
                src={`${BASE_URL}/${product.imageUrl}`}
                alt=""
              />
            </div>
            <span className="product-name">{product.name}</span>
            <span className="overflow-description text-justify">
              {product.description}
            </span>
            <div className="flex flex-row justify-content-between align-items-end w-full">
              <div>
                {product.inStock && (
                  <span className="in-stock">
                    <i className="bi bi-check-circle-fill"></i>
                    {" Available"}
                  </span>
                )}
                {!product.inStock && (
                  <span className="out-of-stock">
                    <i className="bi bi-x-circle-fill"></i>
                    {" No stock"}
                  </span>
                )}
              </div>
              <div className="flex flex-column justify-content-end align-items-end price-continer">
                {product.discountPrice && (
                  <span>
                    <s>{product.price.toFixed(2)} €</s>
                  </span>
                )}
                <span className="price">
                  Price:{" "}
                  <span className="price val">
                    {product.discountPrice
                      ? product.discountPrice.toFixed(2)
                      : product.price.toFixed(2)}{" "}
                    €
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-row align-items-center gap-3 rating">
              {product.rating && (
                <>
                  Rating:
                  <span>{getStars()}</span>
                  {product.rating} / 5
                </>
              )}
              {!product.rating && <span>No ratings yet.</span>}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ProductCard;
