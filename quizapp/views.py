from django.shortcuts import render
from .models import Quiz, Question, Answer
from django.core.paginator import Paginator
from django.http import JsonResponse
import json


def index(request):
	quizzes = Quiz.objects.all()
	context = {"quizzes": quizzes}
	return render(request, "quizapp/index.html", context)
	
	
def quiz_detail(request, id):
	current_page = request.GET.get("page") if request.GET.get("page") != None else "1"
	quiz = Quiz.objects.get(id= id)
	questions_list = quiz.question_set.all()
	paginator = Paginator(questions_list, 1)
	page_number = request.GET.get("page")
	num_of_questions = paginator.num_pages
	
	questions = paginator.get_page(page_number)
	context = {
		"quiz": quiz,
		"questions": questions,
		"current_page": current_page,
		"num_of_questions": num_of_questions
	}
	return render(request, "quizapp/quiz_detail.html", context)
	
	
def get_answers(request):
	answers = json.loads(request.body)
	quiz_id = int(answers.get("quiz_id"))
	backend_answers = []
	result = 0
	
	quiz = Quiz.objects.get(id= quiz_id)
	for question in quiz.question_set.all():
		for backend_answer in question.answer_set.all():
			if backend_answer.is_correct:
				backend_answers.append(str(backend_answer.id))
	
	users_answers = []
	for answer in answers:
		users_answers.append(answers[answer])
	
	for answered, correct in zip(backend_answers, users_answers):
		if answered == correct:
			result += 1
			
	print(result)
	
	return JsonResponse(result, safe= False)