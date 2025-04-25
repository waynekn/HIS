from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Client(models.Model):
    name = models.CharField(max_length=150, verbose_name='client name')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'Client {self.name} | Doctor {self.doctor.username}'
