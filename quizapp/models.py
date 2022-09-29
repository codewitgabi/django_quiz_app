from django.db import models


class Quiz(models.Model):
	name = models.CharField(max_length= 50)
	
	def __str__(self):
		return self.name
		
	class Meta:
		verbose_name_plural = "Quizzes"
		

class Question(models.Model):
	quiz = models.ForeignKey(Quiz, on_delete= models.CASCADE)
	text = models.TextField()
	
	def __str__(self):
		return self.text
		
		
class Answer(models.Model):
	question = models.ForeignKey(Question, on_delete= models.CASCADE)
	answer = models.CharField(max_length= 50)
	is_correct = models.BooleanField(default= False)
	
	def __str__(self):
		return self.answer

