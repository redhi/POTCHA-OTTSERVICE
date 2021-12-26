from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import *
from flask_migrate import Migrate

import config
from db_connect import db
from models import *


def create_app():
    app = Flask(__name__)
    jwt = JWTManager(app)
    CORS(app)

    app.config.from_object(config)

    db.init_app(app)
    Migrate().init_app(app, db)

    from views import (
        detail,
        like,
        main,
        movie_list,
        mypage,
        potato_basket,
        tv_list,
        user,
    )

    app.register_blueprint(user.bp)
    app.register_blueprint(main.bp)
    app.register_blueprint(tv_list.bp)
    app.register_blueprint(movie_list.bp)
    app.register_blueprint(mypage.bp)
    app.register_blueprint(detail.bp)
    app.register_blueprint(like.bp)
    app.register_blueprint(potato_basket.bp)

    return app


if __name__ == "__main__":
    create_app().run("127.0.0.1", 5000, debug=True)
