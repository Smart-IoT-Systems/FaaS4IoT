import json


def format_data(dataToFormat):
	#x = dataToFormat.split()
    entityId=""
    entityType=""
    datatype=""
    datavalue=""
    jsondata=""
    entityId = dataToFormat.split()[0]
    entityType = dataToFormat.split()[1]
    datatype= dataToFormat.split()[2]
    datavalue = dataToFormat.split()[3]
    jsondata =json.dumps({
                "contextElements": [
                    {
                        "entityId": {
                            "id": entityId,
                            "type": entityType
                            },
                        "attributes": [
                              {
                                "name": datatype,
                                "type": "int",
                                "value": datavalue
                            
                                }
                            ]
                    }
                ]})
    #print("here is json data in method 3",jsondata)
    return jsondata