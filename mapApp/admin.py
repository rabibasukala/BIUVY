from django.contrib import admin
from .models import PlaceInfos,PlaceType

class PlaceInfosAdmin(admin.ModelAdmin):
    list_display = ('place_id', 'place_name', 'slug', 'latitude', 'longitude', 'mainImage', 'video', 'created_at', 'updated_at')
    exclude = ('slug',)
admin.site.register(PlaceInfos, PlaceInfosAdmin)
admin.site.register(PlaceType)
