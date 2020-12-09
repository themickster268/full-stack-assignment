# from pymongo import MongoClient
# from bson import ObjectId
# import postcodes_io_api

# client = MongoClient('mongodb://localhost:27017')
# db = client.assignmentDB
# summer2020 = db.summer2020

# api = postcodes_io_api.Api(debug_http=True)

# def add_area(): # TODO: Add 'area' fields to each document in summer2020 co
#     cursor = summer2020.find(
#         {'area':{ "$exists": False}}, 
#         no_cursor_timeout=True
#     )
#     for document in cursor:
#         data = api.get_postcode(str(document['postcode']).upper())
#         if data['status'] == 200:
#             area = data['result']['admin_ward']
#             summer2020.update_one(
#                 {'_id': document['_id']},
#                 {
#                     "$set": {
#                         "area": area
#                     }
#                 }
#             )
#     cursor.close()

# add_area()
# areas = []
# documents = summer2020.find({}, {"area":1, "_id": 0})
# for document in documents:
#     if document in areas:
#         continue
#     else:
#         areas.append(document)
# print(areas)