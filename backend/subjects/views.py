from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Subject
from .serializers import SubjectSerializer
from .permissions import IsAdminOrReadOnly


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    lookup_field = "slug"
# Create your views here.
