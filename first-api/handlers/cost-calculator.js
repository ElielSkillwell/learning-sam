module.exports.CostCalculator = async (event) => {
    try {
        if (!event) {
            throw new Error('Event object is undefined or empty');
        }

        const { price, size, unit, downPayment, downPaymentAmount } = event ?? {};

        const sizeInSqFt = Number(convertSizeToSqFt(size, unit));
        const pricePerUnit = Number ((price / sizeInSqFt).toFixed(1));

        const medianPrice = downPayment
        ? (parseFloat(price) - parseFloat(downPayment) / 100) * parseFloat(price).toFixed(1)
        : downPaymentAmount 
        ? (parseFloat(price) - (parseFloat(downPaymentAmount) / 100) * parseFloat(price)).toFixed(1)
        : (() => {
            throw new Error('Missing downPayment or downPaymentAmount');
        })();

        const totalCost = (parseFloat(price) + Number(downPaymentAmount ?? 0)).toFixed(1);

        const response = {
            statusCode: 200,
            body: JSON.stringify({ 
                pricePerUnit: pricePerUnit.toFixed(1).toString(), 
                medianPrice: medianPrice.toString(), 
                totalCost: totalCost.toString() }),
            headers: {
              'X-Powered-By': 'AWS API Gateway & Lambda Serverless'
            },
            isBase64Encoded: false
          };


    } catch (error) {
        console.error('Error parsing request body:', error.message);
        return {
            statusCode: 400,
            body: 'Error parsing request body',
            headers: {
                'X-Powered-By': 'AWS API Gateway & Lambda Serverless'
            },
            isBase64Encoded: false
        };
    }
};

  // Define a helper function to convert size to square feet
  function convertSizeToSqFt(size, unit) {
      if (unit === 'sqFt') {
          return parseFloat(size);
      } else if (unit === 'sqM') {
          return parseFloat(size) * 10.7639;
      } else {
          // Throw an error if the unit is not supported
          throw new Error('Unsupported unit "' + unit + '"');
      }
  }