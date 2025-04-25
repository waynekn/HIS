from django.urls import path

from . import views

urlpatterns = [
    path("client/create/", views.ClientCreateView.as_view(), name='register_client'),
]
