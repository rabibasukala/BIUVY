from django.db import models
import os
import uuid
from django.utils.text import slugify
# Create your models here.


class PlaceType(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name +' ( id: '+ str(self.id) +')'

class PlaceInfos(models.Model):
    place_id = models.AutoField(primary_key=True)
    place_name = models.CharField(max_length=100)
    slug= models.SlugField(max_length=100, unique=True,blank=True)
    place_description= models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    mainImage = models.ImageField(upload_to='savedimages', default='defaults/defaultimg.jpg')
    video= models.FileField(upload_to='savedvideos', default='defaults/defaultvid.mp4')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # type
    place_type = models.ForeignKey(PlaceType, on_delete=models.CASCADE)


    # district/municipality/ward
    district = models.CharField(max_length=100)
    municipality = models.CharField(max_length=100)
    ward = models.IntegerField()


   # Carousel images
    carouselImage1 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    carouselImage2 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    carouselImage3 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    carouselImage4 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    carouselImage5 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    carouselImage6 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    carouselImage7 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    carouselImage8 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    carouselImage9 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    carouselImage10 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    carouselImage11 = models.ImageField(upload_to='savedcarouselimages', blank=True)
    
    def get_non_blank_carousel_images(self):
        carousel_images = []
        for i in range(1, 12):  #change herer if gield modified//////
            field_name = f'carouselImage{i}'
            image_field = getattr(self, field_name)
            if image_field:
                carousel_images.append(image_field)
        return carousel_images

    def save(self, *args, **kwargs):
# slugify the place_name
        if not self.slug:
            self.slug = slugify(self.place_name)
        # Check if any carousel image fields are filled and enforce uniqueness
        # chnage if carousel image field number is modified
        for i in range(1, 12):
            field_name = f'carouselImage{i}'
            image = getattr(self, field_name, None)
            if image:
                unique_file_name = f'{image.name.split(".")[0]}_{uuid.uuid4().hex[:6]}.{image.name.split(".")[-1]}'
                image.name = unique_file_name
        super(PlaceInfos, self).save(*args, **kwargs)


    def __str__(self):
        
        return self.place_name + ' | ' + str(self.place_id)
    
