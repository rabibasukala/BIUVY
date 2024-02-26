from django.shortcuts import render
from django.shortcuts import redirect,HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils import timezone

from datetime import datetime

def signup(request):
    if request.method == 'POST':
        fname = request.POST['firstname']
        lname = request.POST['lastname']
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        print(fname, lname, username, email, password1, password2)
        # Check inputs:

        # checking passwords
        if str(password1) != str(password2) :
            print("error:Enter the password correctly")
            return render(request, 'auths/signUp.html')
        
        if len(password1) < 8 or len(password2) < 8:
            print("error:Password must be at least 8 characters")
            return render(request, 'auths/signUp.html')
        
        #checking username
        if len(username) < 3:
            print("error:must be grater than 3 letter")
            return render(request, 'auths/signUp.html')

        if not username.isalnum:
            print("error:must be number and letters only")
            return render(request, 'auths/signUp.html')
        
        # creating user
        # import User
        try:
            # check if email is already taken
            if User.objects.filter(email=email).exists():
                print("error:email already taken")
                return render(request, 'auths/signUp.html')
            
            users = User.objects.create_user(username, email, password1)
            users.first_name = fname
            users.last_name = lname
            users.last_login =timezone.now()
            users.save()
            print("user created")

        except:
            print("username already taken")
            return render(request, 'auths/signUp.html')

        return redirect('../signin')
           
        
    return render(request, 'auths/signUp.html')


def signin(request):
    if request.method == 'POST':
        # data from frontend
        username = request.POST['username']
        password = request.POST['password']

        # authentications:
        user=None
       
        # check if mathi ko username is email or actual username
        if '@' in username:
            try:
                user = authenticate(username=User.objects.get(email=username), password=password)
            except:
                print("error:Invalid Login for email")
        else:
            try:
                user = authenticate(username=username, password=password)
            except:
                print("error:Invalid Login for username")

        if user is not None:
            login(request, user)
            print("loggedin")
            return redirect('home')

        else:
            print('cant login try again ')
            return HttpResponse('Invalid Login')
            
    return render(request, 'auths/signIn.html')

@login_required
def signout(request):
    logout(request)
    print("logedohgcalhv")

    return redirect('home')