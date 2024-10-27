from rest_framework import serializers
from .models import User, BlogPost

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'gender', 'bio', 'profile_image', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True},
            'profile_image': {'required': False, 'allow_null': True},
            'phone_number': {'required': False, 'allow_null': True},
            'bio': {'required': False, 'allow_null': True},
            'gender': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            gender=validated_data.get('gender', None),
            bio=validated_data.get('bio', None),
            profile_image=validated_data.get('profile_image', None),
            phone_number=validated_data.get('phone_number', None)
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])  # Ensure password is hashed
        instance.gender = validated_data.get('gender', instance.gender)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.profile_image = validated_data.get('profile_image', instance.profile_image)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.save()
        return instance


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_image']  # Include relevant fields


class BlogPostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)  # Include author details as a nested serializer
    created_at = serializers.SerializerMethodField()
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'thumbnail_url', 'created_at', 'author']  # Include thumbnail if needed

    def create(self, validated_data):
        post = BlogPost.objects.create(**validated_data)
        return post
    
    def get_created_at(self, obj):
        return obj.created_at.strftime("%d %b %Y")

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'created_at', 'author', 'thumbnail_url']
        depth = 1  # This will include author details if you have a related user model