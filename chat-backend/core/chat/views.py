from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from ai_module.ai_service import generate_ai_reply, analyze_conversation

class NewMessageView(APIView):
    def post(self, request):
        conversation_id = request.data.get("conversation_id")
        user_message = request.data.get("message")

        # Create or retrieve conversation
        if not conversation_id:
            convo = Conversation.objects.create()
        else:
            convo = Conversation.objects.get(id=conversation_id)

        # Save user message
        Message.objects.create(conversation=convo, sender='user', content=user_message)

        # Get AI response
        ai_reply = generate_ai_reply(convo.id)

        # Save AI message
        ai_msg = Message.objects.create(conversation=convo, sender='ai', content=ai_reply)

        return Response({
            "conversation_id": convo.id,
            "ai_message": MessageSerializer(ai_msg).data
        })


class ConversationDetailView(APIView):
    def get(self, request, id):
        convo = Conversation.objects.get(id=id)
        serializer = ConversationSerializer(convo)
        return Response(serializer.data)


class EndConversationView(APIView):
    def post(self, request, id):
        convo = Conversation.objects.get(id=id)
        convo.status = 'ended'
        convo.save()

        # Trigger AI analysis
        analyze_conversation(convo.id)

        return Response({"status": "Conversation ended and analysis started."})


class ConversationListView(APIView):
    def get(self, request):
        convos = Conversation.objects.all().order_by('-start_time')
        serializer = ConversationSerializer(convos, many=True)
        return Response(serializer.data)

class AIQueryPastView(APIView):
    def post(self, request):
        query = request.data.get("query")
        filters = request.data.get("filters", {})

        if not query:
            return Response({"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST)

        from ai_module.ai_service import query_past_conversations
        answer, sources = query_past_conversations(query, filters)

        return Response({
            "answer": answer,
            "sources": sources
        }, status=status.HTTP_200_OK)
