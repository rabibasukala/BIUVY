from django.db import models
import os
import uuid
from django.utils.text import slugify
from django.contrib.auth.models import User
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
    


# reviews

class Review(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    rating = models.IntegerField(choices=RATING_CHOICES)
    review_text = models.TextField()
    review_date = models.DateField(auto_now_add=True)
    reviewer_name = models.ForeignKey(User, on_delete=models.CASCADE)
    place_info = models.ForeignKey(PlaceInfos, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.place_info.slug} - {self.reviewer_name.first_name} - {self.rating} Stars ({self.review_date})"

    