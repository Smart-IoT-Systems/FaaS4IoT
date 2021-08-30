import json


def format_dataCSV_toNGSI(dataToFormat):
	#x = dataToFormat.split()
    entityId=""
    entityType=""
    datatype=""
    datavalue=""
    jsondata=""
    entityId = dataToFormat.split(',')[0]
    entityType = dataToFormat.split(',')[1]
    datatype= dataToFormat.split(',')[2]
    datavalue = dataToFormat.split(',')[3]
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
    return jsondata
