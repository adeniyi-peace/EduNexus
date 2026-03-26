# GeoIP Database Setup

To enable geographic tracking, you need to download the MaxMind GeoLite2 database files and place them in this directory.

1.  Sign up for a free MaxMind account: [https://www.maxmind.com/en/geolite2/signup](https://www.maxmind.com/en/geolite2/signup)
2.  Download the **GeoLite2 Country** and **GeoLite2 City** binary databases (`.mmdb` files).
3.  Place `GeoLite2-Country.mmdb` and `GeoLite2-City.mmdb` in this folder.

### Project Configuration
The project is configured to look for these files in:
`backend/geoip/`

If the files are missing, the system will gracefully log a debug message and default to `'Unknown'` for the country code.
