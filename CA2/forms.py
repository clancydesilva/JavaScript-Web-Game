from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, DateField, PasswordField, SelectField, FileField, TextAreaField, SelectMultipleField
from wtforms.validators import InputRequired, EqualTo, Length

class Login (FlaskForm):
    id = StringField("Enter your user ID:", validators=[InputRequired()])
    password = PasswordField("Enter your password:", validators=[InputRequired()])
    submit = SubmitField("Submit")

class RegistrationForm(FlaskForm):
    id = StringField("Enter a username:", validators=[InputRequired()])
    password = PasswordField("Enter a password:", validators=[InputRequired()])
    password2 = PasswordField("Enter the same password again", validators=[EqualTo("password"), InputRequired()])
    submit = SubmitField("Submit")