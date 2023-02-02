from django.contrib import admin
from .models import Question, Answer, Quiz


class AnswerInline(admin.TabularInline):
	model = Answer
	

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
	list_display = ["text"]
	search_fields = ["text"]
	inlines = [AnswerInline]
	

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
	list_display = ["name", "duration"]
	search_fields = ["name"]
	
	
admin.site.register(Answer)