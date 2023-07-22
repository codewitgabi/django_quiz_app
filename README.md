## Installation
Before running the project, ensure you have django installed on your machine if you haven't

```
pip install -r requirements.txt
```

After installation;

```
python manage.py makemigrations
```

to add all tables in the models.py file

```
python manage.py migrate
```

to migrate to database

```
python manage.py createsuperuser
```

creates a super user for you to control apps activities.

finally;

```
python manage.py runserver
```
