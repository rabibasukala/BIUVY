from django.db import models

# Create your models here.
class MapInfo(models.Model):
    nameOfPace = models.CharField(max_length=500)
    descriptionOfplace= models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    image = models.ImageField(upload_to='images/savedimages', default='images/bkt.jpg')
    icon = models.ImageField(upload_to='images/savedicons', default='images/pin.svg')



    def __str__(self):
        return self.nameOfPace