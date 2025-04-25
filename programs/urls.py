from django.urls import path
from . import views

urlpatterns = [
    path('health-programs/', views.HealthProgramRetrieveView.as_view(),
         name='my_health_programs'),
    path('health-program/create/', views.HealthProgramCreateView.as_view(),
         name='create_health_program'),
    path('program/<int:id>/detail/',
         views.HealthProgramDetail.as_view(), name='program_detail'),
]
