from django.urls import path
from .views import RegisterView, LoginView, LogoutView, CustomTokenRefreshView, ValidateTokenView, CreatePostView, PostListView, PostDetailView, PostViewSet, PostDeleteView, PostUpdateView

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('token/refresh', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/validate', ValidateTokenView.as_view(), name='token_validate'),
    path('create-post', CreatePostView.as_view(), name='create_post'),
    path('posts/', PostListView.as_view(), name='post-list'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),  # New URL pattern for post detail
    path('posts/user/<int:user_id>/', PostViewSet.as_view({'get': 'list_by_user'}), name='posts-by-user'),
    path('posts/delete/<int:pk>/', PostDeleteView.as_view(), name='post-delete'),
    path('posts/edit/<int:pk>/', PostUpdateView.as_view(), name='post-edit')
]

