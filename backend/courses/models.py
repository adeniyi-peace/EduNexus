from django.db import models

# Create your models here.

class Course(models.Model):
    DIFFICULTY_CHOICE = (
        ('Beginner','Beginner'),
        ('Intermediate','Intermediate'), 
        ('Advanced','Advanced')
    )

    title = models.CharField(max_length=200)
    instructor = models.ForeignKey("user", related_name="courses", on_delete=models.CASCADE)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to="course thumbnail", height_field=None, width_field=None, max_length=None)
    price = models.DecimalField( max_digits=10, decimal_places=2)
    duration = models.DurationField()
    category = models.ForeignKey("app.Model", related_name="courses", on_delete=models.CASCADE)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICE, default=DIFFICULTY_CHOICE[0][0])