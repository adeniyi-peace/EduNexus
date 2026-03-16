from django.utils import timezone


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
