from django.utils import timezone
from rest_framework.pagination import PageNumberPagination

def format_time_ago(dt):
    """
    Format a datetime as a human-readable 'time ago' string.
    
    Args:
        dt: A datetime object to format
        
    Returns:
        str: Formatted string like "2d ago", "5h ago", "30m ago"
    """
    now = timezone.now()
    diff = now - dt
    if diff.days > 0:
        return f"{diff.days}d ago"
    hours = diff.seconds // 3600
    if hours > 0:
        return f"{hours}h ago"
    minutes = (diff.seconds % 3600) // 60
    return f"{minutes}m ago"


class StandardPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100


def _paginate(queryset, request, serializer_fn):
    """Helper: run standard pagination and return a Response."""
    paginator = StandardPagination()
    page = paginator.paginate_queryset(queryset, request)
    data = [serializer_fn(item) for item in page]
    return paginator.get_paginated_response(data)
