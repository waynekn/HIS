from django.db import models
from django.contrib.auth.models import User

from clients.models import Client


class HealthProgram(models.Model):
    name = models.CharField(max_length=150, verbose_name='health program name')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name} | {self.owner.username}'


class ProgramEnrollment(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    program = models.ForeignKey(HealthProgram, on_delete=models.CASCADE)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.client.name} | program {self.program.name}| doc {self.doctor.username}'
