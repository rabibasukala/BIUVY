from django.urls import path


from . import views
urlpatterns = [
    path('home/', views.home, name='home'),
    path('map/', views.map, name='map'),
    path('splash/', views.splash, name='splash'),
    

    path('description', views.description, name='description'),
]

