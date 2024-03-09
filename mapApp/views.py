from django.shortcuts import render

# Create your views here.
def home(request):
    
    return render(request, 'home.html')


# for demo only. remove after testing
def splash(request):
    return render(request, 'splash.html')

def map(request):
    return render(request, 'map.html')

def description(request):
    return render(request, 'description.html')