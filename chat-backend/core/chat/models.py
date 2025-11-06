import uuid
from django.db import models

class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, default="Untitled Conversation")
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default='active')
    summary = models.TextField(null=True, blank=True)
    topic_keywords = models.JSONField(null=True, blank=True)
    sentiment = models.CharField(max_length=50, null=True, blank=True)
    action_items = models.JSONField(null=True, blank=True)
    share_token = models.UUIDField(default=uuid.uuid4, unique=True)

    def __str__(self):
        return self.title


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=[('user', 'User'), ('ai', 'AI')])
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_key_message = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender}: {self.content[:50]}"
