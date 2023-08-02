from django.db import models
from django.db.models import Count


class Quiz(models.Model):
    name = models.CharField(max_length= 50, unique=True)
    duration = models.IntegerField(default=60, help_text="Enter quiz duration in seconds.")
    
    class Meta:
        verbose_name_plural = "Quizzes"
    
    
    @classmethod
    def quiz_to_show(cls):
        return cls.objects.annotate(
            number_of_questions=Count("question")
        ).filter(number_of_questions__gt=0)
    
    def __str__(self):
        return self.name
 
 
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

