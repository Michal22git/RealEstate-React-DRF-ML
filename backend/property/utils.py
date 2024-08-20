import requests
from geopy.distance import geodesic
from geopy.geocoders import Nominatim


def get_coordinates(address):
    geolocator = Nominatim(user_agent="my_app")
    location = geolocator.geocode(address)
    if location:
        return (location.latitude, location.longitude)
    else:
        raise ValueError(f"Unable to find coordinates for address: {address}")

def count_specific_pois(lat, lon, radius=500):
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (
      nwr["amenity"~"^(school|clinic|post_office|kindergarten|restaurant|college|pharmacy)$"](around:{radius},{lat},{lon});
    );
    out center;
    """
    response = requests.get(overpass_url, params={'data': overpass_query})
    data = response.json()
    return len(data['elements'])

def get_city_center_coords(city_name):
    geolocator = Nominatim(user_agent="my_app")
    location = geolocator.geocode(city_name)
    if location:
        return (location.latitude, location.longitude)
    else:
        raise ValueError(f"Unable to find coordinates for city: {city_name}")

def distance_from_city_center(address, city_name):
    address_coords = get_coordinates(address)
    city_center_coords = get_city_center_coords(city_name)
    distance = geodesic(address_coords, city_center_coords).kilometers
    return distance
