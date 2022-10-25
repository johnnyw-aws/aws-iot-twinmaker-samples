exports.handler = async (event) => {
    return {
        properties: {
            temperature: {
                definition: {
                    dataType: {
                        type: "DOUBLE"
                    },
                    isTimeSeries: true
                }
            },
            humidity: {
                definition: {
                    dataType: {
                        type: "DOUBLE"
                    },
                    isTimeSeries: true
                }
            },
            co2: {
                definition: {
                    dataType: {
                        type: "DOUBLE"
                    },
                    isTimeSeries: true
                }
            },

        }
    }
}