from django.contrib import admin
from .models import PlaceInfos,PlaceType,Review

class PlaceInfosAdmin(admin.ModelAdmin):
    list_display = ('place_id', 'place_name', 'slug', 'latitude', 'longitude', 'mainImage', 'video', 'created_at', 'updated_at')
    exclude = ('slug',)
admin.site.register(PlaceInfos, PlaceInfosAdmin)
admin.site.register(PlaceType)

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('place_info', 'rating', 'review_text', 'reviewer_name','review_date')

admin.site.register(Review, ReviewAdmin)
