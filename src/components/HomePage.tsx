import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import { Button } from "primereact/button";
import React, { useContext, useEffect, useState } from "react";
import { ProductProps } from "./ProductCard.tsx";
import ApiService, { BASE_URL } from "../services/ApiService.ts";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import styles from "./ProductCard.module.css";
import { DataView } from "primereact/dataview";
import { InputTextarea } from "primereact/inputtextarea";
import { LoginContext } from "../contexts/LoginContext.ts";
import axios from "axios";
import Cookies from "js-cookie";
import { useToast } from "../contexts/ToastContext.ts";
import { Divider } from "primereact/divider";

type StoreReview = {
  review: string;
  rating: number;
  id: number;
};

const HomePage = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const loginContext = useContext(LoginContext);
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(0);
  const showToast = useToast();

  const getProducts = async () => {
    const response = (await ApiService.get("/discounts")) as ProductProps[];
    setProducts(response);
    console.log(products);
  };

  useEffect(() => {
    getProducts();
    getReviews();
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

  const getReviews = async () => {
    const url = "/storereviews";
    const response = (await ApiService.get(url)) as StoreReview[];
    setReviews(response);
  };

  const submitReview = async () => {
    await axios.post(
      "http://localhost:8000/api/storereviews",
      {
        review: reviewComment,
        rating: reviewRating,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      },
    );
    getReviews();
    showToast!("success", "Avaliação", "Avaliação submetida com sucesso");
  };

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

  const starsInput = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      return (
        <i
          key={index}
          className={
            index + 1 <= reviewRating ? `bi bi-star-fill` : `bi bi-star`
          }
          onClick={() => setReviewRating(index + 1)}
        ></i>
      );
    });
  };

  const listTemplate = () => {
    if (!reviews || reviews.length === 0) return null;
    const list = reviews.map((review) => {
      return reviewItem(review.review, review.rating, review.id);
    });
    return (
      <div>
        <Divider />
        <div className="grid grid-nogutter">
          {list}
        </div>
      </div>
    );
  };

  const reviewItem = (review, rating, index) => {
    return (
        <>
          <div className={`col-12 flex flex-column gap-2`}>
            <div className="flex flex-row justify-content-start ml-5 gap-4">
              <div className={`${styles.rating}`}>
                {getStars(rating)} {rating}/5
              </div>
            </div>
            <div
                className={`ml-4 flex flex-row justify-content-start ${styles.italic}`}
            >
              "{review}"
            </div>
          </div>
          <Divider/>
        </>
    );
  };

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
        numVisible={4}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={productTemplate}
        circular
        autoplayInterval={3000}
      />
      <Card>
        <div className="mx-8">
          <h1>Avaliações do nosso site</h1>
          <DataView value={reviews} listTemplate={listTemplate} />
          <div
            className="flex flex-column align-items-start gap-2"
            style={{ width: "600px" }}
          >
            {loginContext && (
              <>
                Avalia o nosso site:
                <InputTextarea
                  style={{
                    minWidth: "600px",
                    maxWidth: "600px",
                    minHeight: "75px",
                    maxHeight: "300px",
                  }}
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
                  </div>
                  <Button onClick={submitReview}>Submeter</Button>
                </div>
              </>
            )}
            {!loginContext && "Faça login para avaliar este produto."}
          </div>
        </div>
      </Card>
    </>
  );
};

export default HomePage;
