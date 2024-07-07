from flask import Flask, render_template, redirect, request, session, url_for, g, send_from_directory, after_this_request
from flask_session import Session
from forms import Login, RegistrationForm
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db, close_db
from functools import wraps

app = Flask(__name__)
app.config["SECRET_KEY"] = "key"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.teardown_appcontext(close_db)

@app.before_request
def load_logged_in_user():
    g.user = session.get("user_id", None)

def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

@app.route("/")
def index():
    return render_template("index.html", name=g.user)

@login_required
@app.route("/play")
def game():
    return render_template("game.html")

@app.route("/register", methods=["GET","POST"])
def register(): 
    form = RegistrationForm() 
    if form.validate_on_submit(): 
        id = form.id.data
        password = form.password.data 
        password2 = form.password2.data 
        db = get_db() 
        conflict_user = db.execute( """SELECT * 
                                   FROM users WHERE id = ?;""", (id,)).fetchone() 
        if conflict_user is not None: 
            form.id.errors.append("User name already taken") 
        else:
            db.execute(""" INSERT INTO users (id, password) 
                       VALUES (?, ?);""", (id, generate_password_hash(password))) 
            db.commit()
            return redirect(url_for("login"))
    return render_template("register.html", form=form) 

@app.route("/login", methods=["GET","POST"])
def login():
    form = Login()
    if form.validate_on_submit():
        id = form.id.data
        password = form.password.data
        db = get_db()
        user =  db.execute("""SELECT * FROM users WHERE id=?""", (id,)).fetchone()
        if user is None:
            form.id.errors.append("No such username")
        elif not check_password_hash(user["password"], password):
            form.password.errors.append("Passwords don't match")
        else:
            session.clear()
            session["user_id"] = id
            return redirect(url_for("index"))
    return render_template("login.html", form=form)

@app.route("/store_progress", methods=["POST"])
def store():
    stage = int(request.form["stage_no"])
    clear = request.form["stage_cleared"]
    db = get_db()
    check = db.execute("SELECT * FROM progress WHERE id=? AND stage=?",(g.user,stage)).fetchone()
    if check:
        if check["cleared"] == "false":
            if (check["id"] == g.user and check["stage"] == stage):
                db.execute("""UPDATE progress SET cleared=? WHERE id=? AND stage=?""",(clear,g.user,stage))
                db.commit()
                print("success - progress updated")
                return "success - progress updated"
        else:
            print("success - progress not overwritten as previous clear status better or same")
            return "success - progress not overwritten as previous clear status better or same"
    else:
        db.execute("""INSERT INTO progress (id,stage,cleared) VALUES (?, ?, ?)""", (g.user,stage,clear))
        db.commit()
        print("success - progress recorded")
        return "success - progress recorded"