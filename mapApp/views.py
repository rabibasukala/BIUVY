from django.shortcuts import render
from django.http import HttpResponse
from .models import PlaceInfos
import json
# Create your views here.

def home(request):
    places = PlaceInfos.objects.all()
    location_data = {
        "type": "FeatureCollection",
        "features": []
    }
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
                "place_description": place.place_description,
                "mainImage": place.mainImage.url,
                "video": place.video.url,
                "place_type": place.place_type.name,
                # "created_at": place.created_at,
                # "updated_at": place.updated_at,
             
            },
        },
        )

    
    return render(request, 'home.html', {'location_data': json.dumps(location_data)})



def description(request,slug):  
    # print(slug)
    place_obj = PlaceInfos.objects.get(slug=slug)
    carousel_images=[]
    # we have 10 images in the carousel so we will loop through them and add them to the list
    carousel_images = place_obj.get_non_blank_carousel_images()
    context={
            'place_obj': place_obj,
            'carousel_images':carousel_images,
    }
    # return HttpResponse(place_obj)
    return render(request, 'description.html', context)




# for demo only. remove after testing
def splash(request):
    return render(request, 'splash.html')

