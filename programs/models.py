from django.db import models
from django.contrib.auth.models import User


class HealthProgram(models.Model):
    name = models.CharField(max_length=150, verbose_name='health program name')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name} | {self.owner.username}'
