from rest_framework import status
from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import User, BlogPost
from .serializer import UserSerializer, BlogPostSerializer, PostSerializer
from .throttles import LoginRateThrottle
import cloudinary.uploader
import re
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
import base64
from pathlib import Path
from typing import Union
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile_image = request.FILES.get('profile_image') or None
        if profile_image:
            cloudinary_response = cloudinary.uploader.upload(profile_image, folder="profile_images", overwrite=True)
            request.data['profile_image'] = cloudinary_response['secure_url']
        
        serializer = UserSerializer(data=request.data)
        password = request.data.get('password')
        # if phone_number is None then set it to null
        try:
            validate_password(password)
        except DjangoValidationError as e:
            return Response({"password_error": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
        
        if 'phone_number' in request.data and request.data['phone_number'] == "":
            request.data['phone_number'] = None
            
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create tokens
        refresh = RefreshToken.for_user(user)
        
        response = Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
        
        # Set HttpOnly cookies
        response.set_cookie('access_token', str(refresh.access_token), httponly=True)
        response.set_cookie('refresh_token', str(refresh), httponly=True)
        
        return response

class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            
            response = Response({
                'message': 'Login successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'username': user.username,
                    'id': user.id,
                    'profile_image': user.profile_image.url if user.profile_image else None,  # Ensure this handles missing images
                },
            }, status=status.HTTP_200_OK)
            response.set_cookie('access_token', str(refresh.access_token), httponly=True)
            response.set_cookie('refresh_token', str(refresh), httponly=True)
            
            return response
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token

            response = Response({"detail": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
            
            # Clear cookies
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            # send status code with response
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom view to refresh token and reset cookies.
    """
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token is None:
            return Response({"error": "Refresh token missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Include refresh token in data for refresh process
        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Reset cookies with the new access token
            new_access_token = response.data.get('access')
            response.set_cookie('access_token', new_access_token, httponly=True)
        
        return response

class ValidateTokenView(APIView):
    """
    Validates if the access token in the cookie is still valid.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        access_token = request.COOKIES.get('access_token')
        if access_token is None:
            return Response({'error': 'No access token found'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Decode token to validate
            token = AccessToken(access_token)
            return Response({"message": "Token is valid"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Token is invalid or expired"}, status=status.HTTP_401_UNAUTHORIZED)

class CreatePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.is_anonymous:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        # Make a mutable copy of request.data
        data = request.data.copy()
        
        # Process content to replace base64 images with Cloudinary URLs
        content = data.get('content', '')
        if isinstance(content, bytes):
            content = content.decode()  # Decode bytes to string if necessary

        base64_images = re.findall(r'src="data:image/(.*?);base64,(.*?)"', content)
        if base64_images:
            for image_type, base64_data in base64_images:
                cloudinary_response = cloudinary.uploader.upload(f"data:image/{image_type};base64,{base64_data}", folder="post_images", overwrite=True)
                cloudinary_url = cloudinary_response['secure_url']
                content = content.replace(f'src="data:image/{image_type};base64,{base64_data}"', f'src="{cloudinary_url}"')

        data['content'] = content
        thumbnail = request.FILES['thumbnail_url']
        cloudinary_response = cloudinary.uploader.upload(thumbnail, folder="post_thumbnail", overwrite=True)
        data['thumbnail_url'] = cloudinary_response['secure_url']
        
        # Pass modified data to serializer
        serializer = BlogPostSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostListView(generics.ListAPIView):
    queryset = BlogPost.objects.all().order_by('-created_at')  # Order by newest first
    serializer_class = BlogPostSerializer


class PostDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    
class PostViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this endpoint

    def list_by_user(self, request, user_id):
        # Fetch posts authored by the specified user
        posts = BlogPost.objects.filter(author__id=user_id).order_by('-created_at')  # Order by newest first
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

class PostDeleteView(generics.DestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        post = get_object_or_404(BlogPost, pk=kwargs['pk'])
        if post.author != request.user:
            raise PermissionDenied("You do not have permission to delete this post.")
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PostUpdateView(generics.UpdateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        # Get the existing post
        post = get_object_or_404(BlogPost, pk=pk)
        
        # Ensure the requesting user is the author
        if post.author != request.user:
            raise PermissionDenied("You do not have permission to edit this post.")
        
        # Delete the existing post
        post.delete()
        
        # Prepare data for new post creation
        updated_data = request.data.copy()
        updated_data['author'] = request.user.id

        # Create a new request instance for CreatePostView
        factory = APIRequestFactory()
        new_request = factory.post('/api/posts/create/', data=updated_data, format='multipart')
        new_request.user = request.user  # Set the user on the new request

        # Initialize CreatePostView with the new request
        create_view = CreatePostView.as_view()
        response = create_view(new_request)

        return response