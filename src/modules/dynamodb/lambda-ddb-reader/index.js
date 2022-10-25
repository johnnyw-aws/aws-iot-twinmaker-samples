const TABLE = process.env.DYNAMODB_TABLE_NAME
const aws = require('aws-sdk')
const dynamo = new aws.DynamoDB.DocumentClient()


exports.handler = async (event) => {
    try {

        let {workspaceId, entityId, componentName, selectedProperties, startTime, endTime } = event


        // QUERY THE DATABASE WITH THE SELECTED PROPERTIES
        const {Items} = await dynamo.query({
            TableName: TABLE,
            ProjectionExpression: `${selectedProperties}, #tmsp`,
            KeyConditionExpression: `thingName = :hashKey AND #tmsp BETWEEN :startTime AND :endTime`,
            ExpressionAttributeNames: {
                '#tmsp': 'timestamp'
            },
            ExpressionAttributeValues: {
                ':hashKey': entityId,
                ':startTime': (new Date(startTime)).getTime(),
                ':endTime': (new Date(endTime)).getTime()
            }
        }).promise()

        let results = { propertyValues: [] }
        let res = []
        Items.forEach(item => {

            selectedProperties.forEach(prop => {
                if(!res[prop]){
                    res[prop] = {
                        entityPropertyReference:{
                            propertyName: prop,
                            componentName,
                            entityId: event.entityId

                        },
                        values: []
                    }
                }
                res[prop].values.push({
                    time: (new Date(item['timestamp'])).toISOString(),
                    value: {doubleValue: item[prop]}
                })
            })

        })

        for (let key in res){
            results.propertyValues.push(res[key])
        }

        console.log(results)
        return results
    } catch (e) {
        console.log(e)
    }

}