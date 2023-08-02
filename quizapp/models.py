from django.db import models


class Quiz(models.Model):
    name = models.CharField(max_length= 50, unique=True)
    duration = models.IntegerField(default=60, help_text="Enter quiz duration in seconds.")
    
    class Meta:
        verbose_name_plural = "Quizzes"
    
    
    @classmethod
    def quiz_to_show(cls):
        quizzes = []
        
        for quiz in cls.objects.all():
            if quiz.question_set.all().count() > 0:
                quizzes.append(quiz)
        
        return Quiz.objects.filter(name__in=quizzes)
    
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

