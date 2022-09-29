from django.contrib import admin
from .models import Question, Answer, Quiz


class AnswerInline(admin.TabularInline):
	model = Answer
	

class QuestionAdmin(admin.ModelAdmin):
	list_display = ["text"]
	search_fields = ["text"]
	inlines = [AnswerInline]
	
	
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer)
admin.site.register(Quiz)