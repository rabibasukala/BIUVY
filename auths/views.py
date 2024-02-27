from django.shortcuts import render
from django.shortcuts import redirect,HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from .send_mail import sendmail
import uuid
from .models import ForgetTokenManager


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
                print("error:Invalid Login from email")
        else:
            try:
                user = authenticate(username=username, password=password)
            except:
                print("error:Invalid Login from username")

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


# handle forget password
def forgetPassword(request):
    if request.method == 'POST':
        email = request.POST['email']
        # check if email exists
        if not User.objects.filter(email=email).exists():   #since email is unique we can use filter
            
            print(f"email not exists",email)
            return redirect('forgetPassword')
        

        try:
            #send email to existing email with unique uuid
            uid=str(uuid.uuid4())
            

            #  save token

            user_obj=User.objects.get(email=email)
            print(user_obj.first_name,user_obj.email)
            token_obj,created=ForgetTokenManager.objects.get_or_create(user=user_obj)
         
            # even token is already created we simply just update it
            token_obj.forget_password_token=uid
            print(token_obj.forget_password_token)

            token_obj.save()
            # send mail
            sended=sendmail(email,uid)
            print("sent:",sended)
         
            if not sended:
                print("cant send")
                return render(request, 'auths/forgetPassword.html')
            
            return HttpResponse("Check your email for reset link")

        except Exception as e:
            print("some error occured",e)
            return render(request, 'auths/forgetPassword.html')
        
    return render(request, 'auths/forgetPassword.html')

# used for resetting password
def resetPassword(request,token):

    if request.method=="POST":
        
        try:
            # return the user with token saved
            forgetTokenManager_obj=ForgetTokenManager.objects.get(forget_password_token=token)
            print(forgetTokenManager_obj.user)
            
            # data from front
            password1=request.POST['password1']
            password2=request.POST['password2']

            # check passwords
            if str(password1) != str(password2) :
                print("error:Enter the password correctly")
                return render(request,f"auths/resetPassword/{token}")
                
            if len(password1) < 8 or len(password2) < 8:
                print("error:Password must be at least 8 characters")
                return render(request,f"auths/resetPassword/{token}")
            
            # set new password
            try:
                user=forgetTokenManager_obj.user
                user.set_password(password1)
                user.save()
                print("sucessfully reset password")
                
            except Exception as e:
                print("error:unable to reset password",e)
                return render(request,f"auths/resetPassword/{token}")
            
            return redirect("/auth/signin")


        except Exception as e:
            print("Some error occured",e)
        

    
    return render(request, 'auths/resetPassword.html')