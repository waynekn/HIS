from django.contrib import admin

from . import models

# Register your models here.
admin.site.register(models.HealthProgram)
admin.site.register(models.ProgramEnrollment)
