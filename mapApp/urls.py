from django.urls import path


from . import views
urlpatterns = [
    path('home/', views.home, name='home'),
    path('splash/', views.splash, name='splash'),

    path('description/<str:slug>', views.description, name='description'),
    # path('get_all_place_info', views.get_all_place_info, name='get_all_place_info'),
]

