from django.urls import path
from . import views

urlpatterns = [
    path('health-programs/', views.HealthProgramRetrieveView.as_view(),
         name='my_health_programs'),
]
