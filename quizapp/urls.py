from django.urls import path
from . import views


urlpatterns = [
	path("", views.index, name= "index"),
	path("quiz_detail/<int:id>", views.quiz_detail, name= "quiz_detail"),
	path("get_answers/", views.get_answers, name= "get_answers"),
]