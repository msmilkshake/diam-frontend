import styles from "./ProductDetails.module.css";
import "./ProductDetails.overrides.css";
import { Card } from "primereact/card";
import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import ApiService, { BASE_URL } from "../services/ApiService.ts";
import { ProductProps } from "./ProductCard.tsx";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Divider } from "primereact/divider";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { LoginContext } from "../contexts/LoginContext.ts";
import Cookies from "js-cookie";
import axios from "axios";
import {CartDispatchContext, CartItem} from "../contexts/CartContext.ts";

const ProductDetails = () => {
  const cartDispatch = useContext(CartDispatchContext);
  const user = useContext(LoginContext);
  const { id } = useParams();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [cartQty, setCartQty] = useState<number>(1);
  const [reviews, setReviews] = useState([
    {
      review: "Lorem ipsum 1",
      rating: 4,
      bought: true,
    },
    {
      review: "Lorem ipsum 2",
      rating: 5,
      bought: false,
    },
    {
      review: "Lorem ipsum 3",
      rating: 3,
      bought: true,
    },
  ]);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewBought, setReviewBought] = useState<boolean>(false);

  const loginContext = useContext(LoginContext);

  const getProduct = async () => {
    const url = `/products/${id}`;
    return await ApiService.get(url);
  };

  useEffect(() => {
    getProduct()
      .then((product: ProductProps) => {
        setProduct(product);
        console.log(product);
      })
      .catch((error) => console.error(error));
  }, []);

  const getStars = (value: number) => {
    const intRating = Math.trunc(value);
    const starsArr = [];
    for (let i = 0; i < intRating; i++) {
      starsArr.push(<i key={`star-full-${i}`} className="bi bi-star-fill"></i>);
    }
    if (value - intRating > 0) {
      starsArr.push(<i key={`star-half`} className="bi bi-star-half"></i>);
    }
    for (let i = starsArr.length; i < 5; i++) {
      starsArr.push(<i key={`star-empty-${i}`} className="bi bi-star"></i>);
    }

    return starsArr;
  };

  const getOverallStars = () => {
    if (!product) {
      return [];
    }
    return getStars(product!.rating);
  };

  const reviewItem = (review, rating, bought, index) => {
    return (
      <>
        <div key={"reviewitem" + index} className={`col-12 flex flex-column gap-2`}>
          <div className="flex flex-row justify-content-start ml-5 gap-4">
            <div className={`${styles.rating}`}>
              {getStars(rating)} {rating}/5
            </div>
            <div className={``}>
              {bought ? (
                <>
                  <Badge
                    value={
                      <i
                        className="pi pi-check"
                        style={{ fontSize: "0.5rem" }}
                      />
                    }
                  ></Badge>{" "}
                  Produto adquirido
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div
            className={`ml-4 flex flex-row justify-content-start ${styles.italic}`}
          >
            "{review}"
          </div>
        </div>
        <Divider />
      </>
    );
  };

  const listTemplate = () => {
    if (!reviews || reviews.length === 0) return null;
    let index = 0
    const list = reviews.map((review) =>{
        index++
        return reviewItem(review.review, review.rating, review.bought, index)
    });
    index++
    return (
      <div>
        <Divider />
        <div key={index} className="grid grid-nogutter">{list}</div>
      </div>
    );
  };

  const starsInput = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      return (
        <i key={index}
          className={
            index + 1 <= reviewRating ? `bi bi-star-fill` : `bi bi-star`
          }
          onClick={() => setReviewRating(index + 1)}
        ></i>
      );
    });
  };

  const submitReview = () => {
    console.log("Button clicked!");
    console.log("Review comment:", reviewComment);
    console.log("Review rating:", reviewRating);
    console.log("Review bought:", reviewBought);
  };

  const handleAddToCart = async () => {
    if (user){
      const url = "http://localhost:8000/api/cart";
      const data = {product_id: id, quantity: cartQty};
      const config = {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      };
      const response = await axios.post(url, data, config)
      const cart = (await ApiService.get("/cart") ||
          []) as CartItem[];
      cartDispatch!({
        type: "restore",
        payload: cart,
      });
      console.log("[ProductDetails] Item adicionado ao carrinho:", response)
    }
    else{
        cartDispatch!({type: "add", payload: {id: parseInt(id!), quantity: cartQty, price: product!.price}});
    }
  }

  return (
    <>
      <div className="flex flex-column gap-3 mt-3">
        <div className="grid">
          <div className="col-4">
            <Card>
              <div>
                <img
                  src={`${BASE_URL}/${product?.imageUrl}`}
                  alt=""
                  className="w-full"
                />
              </div>
            </Card>
          </div>
          <div className="col-8">
            <Card className="flex align-items-center px-4 cardContentStretch">
              <div className="flex flex-column justify-content-start align-items-start gap-3">
                <h2>{product?.name}</h2>
                <div
                  className={`flex flex-column justify-content-start align-center-start w-full`}
                >
                  <div className={`grid w-full`}>
                    <div className="col-5 flex flex-column align-items-start gap-1">
                      <div>Preço</div>
                      <span className={`${styles.price} ${styles.val}`}>
                        {product?.discountPrice
                          ? product?.discountPrice.toFixed(2)
                          : product?.price.toFixed(2)}{" "}
                        €
                      </span>
                      {product?.discountPrice && (
                        <span>
                          <s>{product.price.toFixed(2)} €</s>
                        </span>
                      )}
                    </div>
                    {product?.discountPercent && (
                      <div
                        className={`col-4 flex flex-column justify-content-start align-items-center mb-3 ${styles.italic}`}
                      >
                        <h3 className="mt-0">Em Promoção!</h3>
                        <div className={`p-3 ${styles.discount}`}>
                          {product?.discountPercent} % de Desconto!
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`grid nested-grid w-full`}>
                  <div className={`col-5 grid`}>
                    <div className="col-12 flex flex-column align-items-start gap-1">
                      <div>Avaliação</div>
                      <div
                        className={`flex flex-row align-items-center gap-3 ${styles.rating} ${styles.overall}`}
                      >
                        {product?.rating && (
                          <>
                            <span>{getOverallStars()}</span>
                            {product.rating} / 5
                          </>
                        )}
                        {!product?.rating && <span>Sem avaliações.</span>}
                      </div>
                    </div>
                    <div className={`col-12 flex flex-row gap-6`}>
                      <div className="flex flex-column align-items-start gap-1">
                        <div>Stock</div>
                        {product?.inStock && (
                          <span className={`${styles.inStock}`}>
                            <i className="bi bi-check-circle-fill"></i>
                            {" Em stock"}
                          </span>
                        )}
                        {!product?.inStock && (
                          <span className={`${styles.outOfStock}`}>
                            <i className="bi bi-x-circle-fill"></i>
                            {" Sem stock"}
                          </span>
                        )}
                      </div>
                      <div></div>
                    </div>
                  </div>
                  <div
                    className={`col-4 flex flex-column gap-2 align-items-start`}
                  >
                    <div>
                      <InputNumber
                        inputStyle={{ textAlign: "center" }}
                        value={cartQty}
                        onValueChange={(e) => setCartQty(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        size={1}
                        min={1}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus"
                        decrementButtonIcon="pi pi-minus"
                      />
                    </div>
                    <div>
                      <Button onClick={handleAddToCart} className="p-button-secondary">
                        <div className="flex flex-row gap-2">
                          <i className="bi bi-cart" />
                          Adicionar ao carrinho
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-12">
            <Card>
              <div className="mx-8">
                <p style={{ textAlign: "left" }}>
                  <strong>Descrição</strong>
                </p>
                <p style={{ textAlign: "justify" }}>{product?.description}</p>
              </div>
            </Card>
          </div>
        </div>
        <Card>
          <div className="mx-8">
            <p style={{ textAlign: "left" }}>
              <strong>Avaliações</strong>
            </p>
            <DataView value={reviews} listTemplate={listTemplate} />
            <div
              className="flex flex-column align-items-start gap-2"
              style={{ width: "600px" }}
            >
              {loginContext && (
                <>
                  Avalia este produto:
                  <InputTextarea
                    style={{ minWidth: "600px", maxWidth:"600px", minHeight:"75px", maxHeight:"300px"}}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                  <div className="flex flex-row justify-content-between align-items-end w-full">
                    <div className="flex flex-column align-items-start gap-2">
                      <div
                        className={`${styles.rating} ${styles.overall} flex flex-row gap-1`}
                      >
                        {starsInput()}
                      </div>
                      <div className="flex flex-row gap-2">
                        <Checkbox
                          checked={reviewBought}
                          onChange={() => setReviewBought(!reviewBought)}
                        />
                        Comprei este produto
                      </div>
                    </div>
                    <Button onClick={submitReview}>Submeter</Button>
                  </div>
                </>
              )}
              {!loginContext && "Faça login para avaliar este produto."}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ProductDetails;
