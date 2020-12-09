from flask import Flask, make_response, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS
from operator import itemgetter
from datetime import datetime

now = datetime.now()

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017')
db = client.assignmentDB
summer2020 = db.summer2020

# GET all post code data  - DONE
    # postcode string in query string to search for postcodes
    # GET - get all postcode data for a particular area
@app.route('/postcode-data', methods=['GET'])
def postcode_data():
    data_to_return = []

    if request.args.get("postcode-string"):
        for postcode in summer2020.find(
            {
                'area':{"$exists": True}, # only include docs that have area field
                'postcode': {"$regex": str(request.args.get('postcode-string')), "$options": "$i"} ## search for postcodes using substring
            }, 
            {
                "postcode": 1,
                "postcode_space": 1,
                "area":1 ,
                "% of premises with 30<300Mbit/s download speed": 1,
                "% of premises with >=300Mbit/s download speed": 1,
                "% of premises with 0<2Mbit/s download speed": 1,
                "% of premises with 2<5Mbit/s download speed": 1,
                "% of premises with 5<10Mbit/s download speed": 1,
                "% of premises with 10<30Mbit/s download speed": 1,
                "% of premises below the USO": 1,
                "comments": 1
            }
        ): #.skip(page_start).limit(page_size) 
            postcode['_id'] = str(postcode['_id'])
            data_to_return.append(postcode) # return postcodes that corresponds to postcode search
        return make_response(jsonify(data_to_return), 200)
    elif request.args.get("area"):
        area = str(request.args.get("area")).title()
        for postcode in summer2020.find(
            {'area': area},
            {
                "postcode": 1,
                "postcode_space": 1,
                "area": 1,
                "% of premises with 30<300Mbit/s download speed": 1,
                "% of premises with >=300Mbit/s download speed": 1,
                "% of premises with 0<2Mbit/s download speed": 1,
                "% of premises with 2<5Mbit/s download speed": 1,
                "% of premises with 5<10Mbit/s download speed": 1,
                "% of premises with 10<30Mbit/s download speed": 1,
                "% of premises below the USO": 1,
                "comments": 1
            }
        ): 
            postcode['_id'] = str(postcode['_id'])
            for comment in postcode['comments']:
                comment['_id'] = str(postcode['_id'])
            data_to_return.append(postcode)
        return make_response(jsonify(data_to_return), 200) # return postcodes for a particular area
    else:
        for postcode in summer2020.find(
            {'area':{"$exists": True}},
            {
                "postcode": 1,
                "postcode_space": 1,
                "area": 1,
                "% of premises with 30<300Mbit/s download speed": 1,
                "% of premises with >=300Mbit/s download speed": 1,
                "% of premises with 0<2Mbit/s download speed": 1,
                "% of premises with 2<5Mbit/s download speed": 1,
                "% of premises with 5<10Mbit/s download speed": 1,
                "% of premises with 10<30Mbit/s download speed": 1,
                "% of premises below the USO": "0",
                "comments": 1
            }
        ): # .skip(page_start).limit(page_size)
            postcode['_id'] = str(postcode['_id'])
            for comment in postcode['comments']:
                comment['_id'] = str(comment['_id'])
            data_to_return.append(postcode)
        return make_response(jsonify(data_to_return), 200)

# GET get data for one postcode
@app.route('/postcode-data/<string:id>', methods=['GET'])
def one_postcode(id):
    if len(id) == 24:
        postcode = summer2020.find_one(
            {'_id': ObjectId(id), 'area':{"$exists": True}},
            {
                "postcode": 1,
                "postcode_space": 1,
                "area": 1,
                "% of premises with 30<300Mbit/s download speed": 1,
                "% of premises with >=300Mbit/s download speed": 1,
                "% of premises with 0<2Mbit/s download speed": 1,
                "% of premises with 2<5Mbit/s download speed": 1,
                "% of premises with 5<10Mbit/s download speed": 1,
                "% of premises with 10<30Mbit/s download speed": 1,
                "% of premises below the USO": "0",
                "comments": 1
            }
        )
        if postcode is not None:
            postcode['_id'] = str(postcode['_id'])
            for comment in postcode['comments']:
                comment['_id'] = str(comment['_id'])
            return make_response(jsonify(postcode), 200)
        else:
            return make_response(jsonify({'error': 'Cannot find data for this postcode'}), 404)
    else:
        return make_response(jsonify({'error': 'Invalid ID'}, 404))

# GET comments for one postcode
@app.route('/postcode-data/<string:p_id>/comments', methods=['GET'])
def post_comment(p_id):
    if len(p_id) == 24:
        postcode = summer2020.find_one(
            {'_id': ObjectId(p_id), 'area':{"$exists": True}},
            {'_id': 0, 'comments': 1}
        )
        if postcode is not None:
            data_to_return = []
            for comment in postcode['comments']:
                comment['_id'] = str(comment['_id'])
                data_to_return.append(comment)
            # Add logic here to sort comments by rating or date posted/edited
            if request.args.get('sorting-option'):
                sorting_option = str(request.args.get('sorting-option'))
                if sorting_option == "high":
                    data_to_return = sorted(data_to_return, key=itemgetter('rating'), reverse=True) # highest rating to lowest
                elif sorting_option == "low":
                    data_to_return = sorted(data_to_return, key=itemgetter('rating')) # lowest to highest
                elif sorting_option == "latest":
                    data_to_return = sorted(data_to_return, key=itemgetter('date'), reverse=True) # latest posts first
                elif sorting_option =="oldest":
                    data_to_return = sorted(data_to_return, key=itemgetter('date'))
                else:
                    return make_response(jsonify({'error': 'Invalid sorting option selected'}), 404)
                return make_response(jsonify(data_to_return), 200)
            else:
                return make_response(jsonify(data_to_return), 200)
        else:
            return make_response(jsonify({'error': 'Could not find data for that postcode'}), 404)
    else:
        return make_response(jsonify({'error': 'Invalid postcode ID'}), 404)

# GET - get one comment for a postcode
@app.route('/postcode-data/<string:p_id>/comments/<string:c_id>', methods=['GET'])
def get_postcode_comment(p_id, c_id):
    if len(p_id) == 24:
        if len(c_id) ==24:
            postcode = summer2020.find_one(
                {'comments._id': ObjectId(c_id), 'area':{"$exists": True}},
                {
                    '_id': 0,
                    'comments.$': 1
                }
            )
            if postcode is not None:
                postcode['comments'][0]['_id'] = str(postcode['comments'][0]['_id'])
                return make_response(jsonify(postcode['comments'][0]),200)
            else:
                return make_response(jsonify({'error', 'Could not find data for this postcode'}), 404)
        else:
            return make_response(jsonify({'error': 'Invalid comment ID'}), 404)
    else:
        return make_response(jsonify({'error': 'Invalid postcode ID'}), 404)

# POST a comment for one postcode
@app.route('/postcode-data/<string:p_id>/comments', methods=['POST'])
def get_comments(p_id):
    if len(p_id) == 24:
        postcode = summer2020.find_one(
            {'_id': ObjectId(p_id), 'area':{"$exists": True}}
        )
        if postcode is not None:
            if "name" in request.form and "comment" in request.form and "rating" in request.form :
                date = ''
                if "date" in request.form:
                    date = request.form["date"]
                else:
                    date = now.strftime("%e-%m-%Y")
                new_comment = {
                    "_id" : ObjectId(),
                    'name': request.form['name'],
                    'comment': request.form['comment'],
                    "date": date.strip(), #TODO
                    'rating': float(request.form['rating']),
                    "edited": False
                }
                summer2020.update_one(
                    {'_id': ObjectId(p_id)},
                    {
                        '$push': {
                            "comments": new_comment
                        }
                    }
                )
                new_comment_link = "http://localhost:5000/postcode-data/" + p_id + '/comments/' + str(new_comment['_id'])
                return make_response(jsonify({'new_comment_url': new_comment_link}), 201)
            else:
                return make_response(jsonify({'error': 'Invalid form data'}), 404)
        else:
            return make_response(jsonify({'error': 'Could not find data for postcode'}), 404)
    else:
        return make_response(jsonify({'error': 'Invalid ID for postcode document'}), 404)

# PUT - edit a comment for a psotcode
@app.route('/postcode-data/<string:p_id>/comments/<string:c_id>', methods=['PUT'])
def edit_postcode_comment(p_id, c_id):
    if len(p_id):
        if len(c_id) == 24:
            if "name" in request.form and "comment" in request.form and "rating" in request.form :
                date = ''
                if "date" in request.form:
                    date = request.form["date"]
                else:
                    date = now.strftime("%e-%m-%Y")
                edited_comment = { 
                    "comments.$.name": request.form['name'],
                    "comments.$.comment": request.form['comment'],
                    "comments.$.date": date.strip(), #TODO
                    "comments.$.rating": float(request.form['rating']),
                    "comments.$.edited" :True
                }
                summer2020.update_one(
                    {'comments._id': ObjectId(c_id)},
                    {
                        "$set": edited_comment
                    }
                )

                edited_comment_link = 'http://localhost:5000/postcode-data/' + p_id + '/comments/' + c_id
                return make_response(jsonify({'edited_comment_url': edited_comment_link}), 200)
            else:
                return make_response(jsonify({'error': 'Invalid form data'}), 404)
        else:
            return make_response(jsonify({'error': 'Invalid comment ID'}), 404)
    else:
        return make_response(jsonify({'error': 'Invalid postcode ID'}), 404)

# DELETE - delete a comment for a postcode
@app.route('/postcode-data/<string:p_id>/comments/<string:c_id>', methods=['DELETE'])
def delete_postcode_comment(p_id, c_id):
    if len(p_id) == 24:
        if len(c_id) == 24:
            summer2020.update_one(
                {"_id": ObjectId(p_id)},
                {
                    "$pull": {
                        "comments": {
                            "_id": ObjectId(c_id)
                        }
                    }
                }
            )
            return make_response(jsonify({}), 204)
        else:
            return make_response(jsonify({'error': 'Invalid comment ID'}), 404)
    else:
        return make_response(jsonify({'error': 'Invalid post ID'}), 404)

# GET - return postcodes with lowest % of premises under USO
@app.route('/postcode-data/USO', methods=['GET'])
def premises_below_USO():
    postcodes = summer2020.find(
        {'area':{"$exists": True}},
        {
            "postcode": 1,
            "postcode_space": 1,
            "area": 1,
            "% of premises with 30<300Mbit/s download speed": 1,
            "% of premises with >=300Mbit/s download speed": 1,
            "% of premises with 0<2Mbit/s download speed": 1,
            "% of premises with 2<5Mbit/s download speed": 1,
            "% of premises with 5<10Mbit/s download speed": 1,
            "% of premises with 10<30Mbit/s download speed": 1,
            "% of premises below the USO": 1,
            "comments": 1
        }
    ).sort("% of premises below the USO", 1) # sort in ascending order - premises with lowest % below USO  will appear first
    if postcodes is not None:
        data = []
        rank = 1
        for postcode in postcodes:
            postcode['_id'] = str(postcode['_id'])
            postcode['rank'] = rank
            rank = rank + 1
            for comment in postcode['comments']:
                comment['_id'] = str(comment['_id'])
            data.append(postcode)
        return make_response(jsonify(data)) # return premises below USO
    else:
        return make_response(jsonify({'error': 'Cannot find postcodes'}), 200)

if __name__ == "__main__":
    app.run(debug=True)