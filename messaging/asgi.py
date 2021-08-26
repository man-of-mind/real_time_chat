"""
ASGI config for messaging project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
import django
from channels.http import AsgiHandler
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import chatApp.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'messaging.settings')
django.setup()


application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            chatApp.routing.websocket_urlpatterns
        )
    ),
})