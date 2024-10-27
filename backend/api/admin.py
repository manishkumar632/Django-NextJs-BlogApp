from django.contrib import admin
from django.contrib.auth.models import User
from .models import User, BlogPost, Like, Comment, Share

# Register the UserProfile model
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'bio', 'profile_image', 'is_superuser')

# Register the BlogPost model
@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('author', 'title', 'created_at', 'updated_at')
    search_fields = ('title', 'user__username')  # Add search functionality by title and username
    list_filter = ('created_at', 'updated_at')  # Filter by creation and update time

# Register the Like model
@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    search_fields = ('user__username', 'post__title')

# Register the Comment model
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'content', 'created_at')
    search_fields = ('user__username', 'post__title')
    list_filter = ('created_at',)

# Register the Share model
@admin.register(Share)
class ShareAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'platform', 'created_at')
    search_fields = ('user__username', 'post__title', 'platform')
