
import "primeflex/primeflex.css"
import {Card} from "primereact/card";
import {useParams} from "react-router-dom";

const ProductDetails = () => {
    const { id } = useParams();

    return (
        <>
            <div className="">
                <span>Product id: {id}</span>
                <Card>

                </Card>
                <Card>

                </Card>
            </div>
        </>
    )
}

export default ProductDetails