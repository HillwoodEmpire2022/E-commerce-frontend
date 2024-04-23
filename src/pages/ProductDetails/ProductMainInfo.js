import React from 'react';
import SmallImagesContainer from './SmallImagesContainer';
import DisplayCurrency from '../../components/Currency/DisplayCurrency/DisplayCurrency';

function removeDuplicateMeasurement(variations) {
  const measuremts = variations.reduce((acc, variation) => {
    const newMeasuremt = acc.find(
      (measurement) =>
        measurement.measurement ===
        variation.measurementvalue
    );

    if (!newMeasuremt)
      return [
        ...acc,
        {
          measurement: variation.measurementvalue,
          qunatity:
            variation.colorMeasurementVariationQuantity,
          color: variation.colorImg.colorName,
        },
      ];
    else return [...acc];
  }, []);

  return measuremts;
}

const ProductMainInfo = ({
  product,
  dispatch,
  selectedMeasurement,
  selectedColor,
  activeImage,
}) => {
  const measurements = removeDuplicateMeasurement(
    product.colorMeasurementVariations.variations
  );

  const handleSizeClick = (e) => {
    dispatch({
      type: 'sizeSelected',
      payload: e.target.textContent,
    });
  };

  // Notify User when color size combination selected is not available
  const handleInsufficientQuantityHover = (e) => {
    alert(
      `${product.name}: ${selectedColor} : ${e.target.textContent} not available.`
    );
  };

  return (
    <div className='flex flex-col w-container lg:max-w-[30%] xl:w-[30%] gap-5 '>
      <div>
        <p className='w-full h-max-[65px] text-xl font-semibold block capitalize'>
          {product?.name}
        </p>
        <hr className='w-full h-0.5 border-0 bg-gray-200 my-3'></hr>
      </div>
      <div>
        <p className='text-lg mb-1 block font-semibold'>
          Price:
        </p>
        <div className='text-2xl text-[#1D6F2B] font-semibold'>
          <DisplayCurrency product={product} />
        </div>
        {product?.discountPercentage > 0 ? (
          <p className='inline-block text-base text-[#00000080] font-normal line-through'>
            {product?.price} RWF
          </p>
        ) : (
          ''
        )}
        {product?.discountPercentage > 0 && (
          <p className='inline-block text-xs bg-[rgba(201,195,195,0.39)] py-[4px] px-[10px] ml-3 rounded-2xl text-[#FF4747] font-bold'>
            {product?.discountPercentage + '% off'}
          </p>
        )}
      </div>

      {product.hasColors &&
        product?.colorMeasurementVariations.variations
          .length > 0 && (
          <div>
            <p className='text-lg font-semibold flex items-center mb-4 capitalize'>
              <span className='bg-[#1D6F2B] text-white text-base font-medium me-2 px-2.5 py-0.5 rounded'>
                Color:
              </span>
              {selectedColor}
            </p>
            <SmallImagesContainer
              images={[
                ...product?.colorMeasurementVariations.variations.map(
                  (variation) => variation.colorImg
                ),
              ]}
              activeImage={activeImage}
              dispatch={dispatch}
              variations={
                product?.colorMeasurementVariations
                  .variations
              }
              feature='colorImages'
              selectedMeasurement={selectedMeasurement}
            />
          </div>
        )}

      {product.hasMeasurements &&
        measurements.length > 0 && (
          <div>
            <p className='text-lg font-semibold flex items-center mb-4 capitalize'>
              <span className='bg-[#1D6F2B] text-white text-base font-medium me-2 px-2.5 py-0.5 rounded'>
                {
                  product?.colorMeasurementVariations
                    .measurementType
                }
                :
              </span>
              {selectedMeasurement}
            </p>

            <div className='flex flex-wrap gap-1'>
              {measurements.map((measurement) => {
                const colorMeasurementCombinationNotAvailable =
                  selectedColor === measurement.color &&
                  measurement.qunatity === 0;
                return (
                  <button
                    disabled={
                      colorMeasurementCombinationNotAvailable
                    }
                    onMouseOver={(e) => {
                      colorMeasurementCombinationNotAvailable &&
                        handleInsufficientQuantityHover(e);
                    }}
                    key={measurement.measurement}
                    className={`border-[2px] rounded  capitalize py-1 px-2 cursor-pointer text-sm disabled:opacity-30 disabled:cursor-not-allowed ${
                      selectedMeasurement ===
                      measurement.measurement
                        ? 'border-dashed border-7 border-orange-400 shadow-orange-400 drop-shadow-xl'
                        : ''
                    }`}
                    onClick={handleSizeClick}
                  >
                    {measurement.measurement}
                  </button>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
};

export default ProductMainInfo;
