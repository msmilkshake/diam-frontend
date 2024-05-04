import { Slider } from "primereact/slider";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import React from "react";
import { Divider } from "primereact/divider";

const ProductFilter = ({
  priceSliderValue,
  productMinMax,
  onSliderChange,
  inStockFilter,
  inSaleFilter,
  onStockCheck,
  onSaleCheck,
  onApplyFilterClick,
  onResetFilterClick,
}) => {
  return (
      <div className="flex flex-column">
          <h3>Filters</h3>
          <Divider align="left">
              <span>Price</span>
          </Divider>
          <div className="flex flex-column gap-4 align-items-center mb-4">
              <div className="flex flex-row justify-content-between w-full">
                  <span>Min: {priceSliderValue[0].toFixed(2)} €</span>
                  <span>Max: {priceSliderValue[1].toFixed(2)} €</span>
              </div>
              <Slider
                  style={{width: "80%"}}
                  value={priceSliderValue}
                  min={productMinMax[0]}
                  max={productMinMax[1]}
                  step={1}
                  onChange={onSliderChange}
                  // className="w-14rem"
                  range
              />
          </div>
          <Divider align="left">
              <span>Stock</span>
          </Divider>
          <div className="flex flex-row align-items-center justify-content-start gap-3 ml-4 mb-4">
              <Checkbox
                  checked={inStockFilter}
                  onChange={onStockCheck}
                  inputId="stock-filter"
              ></Checkbox>
              <label htmlFor="stock-filter">In stock only</label>
          </div>
          <Divider align="left">
              <span>Sale</span>
          </Divider>
          <div className="flex flex-row align-items-center justify-content-start gap-3 ml-4 mb-4">
              <Checkbox
                  checked={inSaleFilter}
                  onChange={onSaleCheck}
                  inputId="sale-filter"
              ></Checkbox>
              <label htmlFor="sale-filter">On sale only</label>
          </div>
          <div className="flex flex-row justify-content-center gap-3 mb-4 mb-4">
              <Button onClick={onApplyFilterClick}>Apply filters</Button>
              <Button onClick={onResetFilterClick} outlined>
                  Reset filters
              </Button>
          </div>
      </div>
  );
};

export default ProductFilter;
