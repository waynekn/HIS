from django.urls import path
from . import views

urlpatterns = [
    path('health-programs/', views.HealthProgramRetrieveView.as_view(),
         name='my_health_programs'),
    path('health-program/create/', views.HealthProgramCreateView.as_view(),
         name='create_health_program'),
    path('program/<int:id>/detail/',
         views.HealthProgramDetail.as_view(), name='program_detail'),
    path(
        'programs/<int:id>/non-enrollments/',
        views.DoctorProgramsNotEnrolledView.as_view(),
        name='client_non_enrolled_programs'
    ),
    path(
        'programs/<int:id>/enroll/',
        views.ProgramEnrollmentCreateView.as_view(),
        name='enroll_client_in_programs'
    ),

]
