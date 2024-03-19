from django.shortcuts import render
from django.http import HttpResponse
from .models import PlaceInfos,PlaceType
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




#TODO for demo only. remove after testing
def splash(request):
    return render(request, 'splash.html')

