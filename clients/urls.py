from django.urls import path

from . import views

urlpatterns = [
    path("client/create/", views.ClientCreateView.as_view(), name='register_client'),
    path("client/list/", views.ClientRetrievalView.as_view(), name='client_list'),
    path("client/<int:id>/detail/",
         views.ClientDetailView.as_view(), name='client_detail'),
    path("client/search/",
         views.ClientSearchView.as_view(), name='client_search'),
]
