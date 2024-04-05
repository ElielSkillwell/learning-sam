module.exports.MedianPriceCalculator = async (event) => {
    let region = event.region;
    let medianPrice;

    const medianPrices = {
        US: 320000.0,
        CA: 240000.0,
        BR: 260000.0,
    };

    if (medianPrices.hasOwnProperty(region)) {
        medianPrice = medianPrices[region];
    } else {
        medianPrice = medianPrices.US;
        region = 'UNKNOWN REGION'
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({ region: region, medianPrice: medianPrice }),
        headers: {
            'X-Powered-By': 'AWS API Gateway & Lambda'
        },
        isBase64Encoded: false
    };

    return response;
}
