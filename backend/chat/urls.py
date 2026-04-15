from django.urls import path
from . import views

urlpatterns = [
    # Chat rooms (course group)
    path('rooms/', views.ChatRoomListView.as_view(), name='chat-room-list'),

    # Direct messages
    path('dms/', views.DirectMessageListView.as_view(), name='dm-list'),
    path('dms/start/', views.StartDMView.as_view(), name='dm-start'),

    # Messages (shared for both room types)
    path('messages/', views.MessageListView.as_view(), name='message-list'),

    # File upload
    path('upload/', views.FileUploadView.as_view(), name='chat-file-upload'),

    # Room participants (for DM user picker)
    path('participants/', views.RoomParticipantsView.as_view(), name='room-participants'),
]
