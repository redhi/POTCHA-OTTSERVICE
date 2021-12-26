from flask import Blueprint, abort, jsonify
from flask_jwt_extended import *
from models import *

bp = Blueprint("detail", __name__, url_prefix="/api")


@bp.route("/detail/<string:category>/<int:id>", methods=["GET"])
@jwt_required()
def detail(category, id):

    user_id = get_jwt_identity()
    potato = Potato_Basket.query.filter(Potato_Basket.user_id == user_id).all()

    if category == "movie":
        movie = Movie.query.filter(Movie.id == id).first()
        content = Movie.to_dict(movie)
        like_list = [movie.movie_id for movie in potato if movie.movie_id]

    if category == "tv":
        tv = Tv.query.filter(Tv.id == id).first()
        content = Tv.to_dict(tv)
        like_list = [tv.tv_id for tv in potato if tv.tv_id]

    is_like = False
    for likes in like_list:
        if likes == id:
            is_like = True

    return jsonify({"content": content, "is_like": is_like})
