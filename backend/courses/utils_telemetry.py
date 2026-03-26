from ipware import get_client_ip
import logging
from django.contrib.gis.geoip2 import GeoIP2
from django.conf import settings

logger = logging.getLogger(__name__)

def resolve_country_from_ip(ip):
    """
    Attempts to resolve country code from an IP address using GeoIP2.
    """
    if not ip or ip in ['127.0.0.1', '::1', 'localhost']:
        return 'Unknown'
        
    try:
        g = GeoIP2()
        country_info = g.country(ip)
        return country_info.get('country_code', 'Unknown')
    except Exception as e:
        # Gracefully handle missing database or binary mismatches in dev
        logger.debug(f"GeoIP resolution failed for IP {ip}: {e}")
        return 'Unknown'

def get_telemetry_data(request):
    """
    Extracts device type, country code, and default traffic source from request.
    """
    # 1. Device Type
    device_type = 'Desktop'
    if hasattr(request, 'user_agent'):
        if request.user_agent.is_mobile:
            device_type = 'Mobile'
        elif request.user_agent.is_tablet:
            device_type = 'Tablet'
        elif request.user_agent.is_pc:
            device_type = 'Desktop'

    # 2. Country Code (Cloudflare / Vercel headers, or fallback to GeoIP)
    country_code = request.META.get('HTTP_CF_IPCOUNTRY') or \
                   request.META.get('HTTP_X_VERCEL_IP_COUNTRY')
    
    # 3. IP Address (get real IP via ipware)
    client_ip, is_routable = get_client_ip(request)

    # 4. Fallback: if not found in headers, use GeoIP lookup
    if not country_code:
        country_code = resolve_country_from_ip(client_ip)

    return {
        'device_type': device_type,
        'country_code': country_code or 'Unknown',
        'client_ip': client_ip
    }
