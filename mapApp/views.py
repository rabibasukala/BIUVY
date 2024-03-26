from django.shortcuts import render,redirect
from django.http import HttpResponse
from .models import PlaceInfos,PlaceType,Review
import json

# Create your views here.

def home(request):
    place_type = request.GET.get('place_type', None)
    district = request.GET.get('district', None)
    municipality = request.GET.get('municipality', None)
    ward = request.GET.get('ward', None)

    # print(place_type, district, municipality, ward)



    # this is template for the geojson data
    location_data = {
        "type": "FeatureCollection",
        "features": []
    }

    # if no search
    if len(request.GET) == 0:
        # print("no search")
        places = PlaceInfos.objects.all()

    # if advance search
    if not place_type is None:
        # print("advance search")
        place_type = PlaceType.objects.get(name=place_type)
        places= PlaceInfos.objects.filter(place_type=place_type.id)
        

    # if basic search
    if not district is None and not municipality is None and not ward is None:
        # print("basic search")
        places = PlaceInfos.objects.filter(district=district, municipality=municipality, ward=ward)
        # print(places)
 
    if len(places) > 0:
        for place in places:
            location_data["features"].append(
                {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [place.longitude, place.latitude],
                },
                "properties": {

                    "place_id": place.place_id,
                    "place_name": place.place_name,
                    "slug": place.slug,
                    # "place_description": place.place_description,
                    "mainImage": place.mainImage.url,
                    # "video": place.video.url,
                    "place_type": place.place_type.name,
                    # "district" :place.district,
                    # "municipality" :place.municipality,
                    # "ward" :place.ward

                    # "created_at": place.created_at,
                    # "updated_at": place.updated_at,
                
                },
            },
            )

    return render(request, 'home.html', {'location_data': json.dumps(location_data)})



def description(request,slug):

    # get the place(unique slug)
    place_obj = PlaceInfos.objects.get(slug=slug)

    # get the reviews of the place(unique slug)
    review_obj = Review.objects.filter(place_info__slug=slug).order_by('-review_date')
    # print(type(review_obj[0].rating))   ----> <class 'int'>


    carousel_images=[]
    # we have 10 images in the carousel so we will loop through them and add them to the list
    carousel_images = place_obj.get_non_blank_carousel_images()
    context={
            'place_obj': place_obj,
            'carousel_images':carousel_images,
            'review_obj':review_obj
    }


    # post the review
    if request.method == 'POST':
        rating=request.POST.get('rating')
        place_slug=request.POST.get('place_slug')
        review_text=request.POST.get('reviewtext')
        user=request.user
        place_info = PlaceInfos.objects.get(slug=place_slug)
     

        review = Review.objects.create(rating=rating, review_text=review_text, place_info=place_info,reviewer_name=user)

        return redirect('description',slug=place_slug)
    
    return render(request, 'description.html', context)




#TODO for demo only. remove after testing
def splash(request):
    return render(request, 'splash.html')

