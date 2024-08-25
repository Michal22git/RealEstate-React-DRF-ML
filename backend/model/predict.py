import joblib
import pandas as pd


model = joblib.load('apartment_price_model.joblib')

def get_user_input():
    data = {
        'city': 'Wroclaw',
        'type': 'blockOfFlats',
        'squareMeters': 92.0,
        'rooms': 2.0,
        'floor': 4.0,
        'floorCount': 4.0,
        'buildYear': 1960,
        'latitude': 51.094835,
        'longitude': 16.990351,
        'centreDistance': 3.5,
        'poiCount': 35,
        'ownership': 'condominium',
        'condition': 'premium',
        'hasParkingSpace': 0,
        'hasBalcony': 1,
        'hasElevator': 0,
        'hasSecurity': 0,
        'hasStorageRoom': 1
    }

    return pd.DataFrame([data])


def predict_price(input_data):
    prediction = model.predict(input_data)
    return prediction[0]


if __name__ == "__main__":
    input_data = get_user_input()
    predicted_price = predict_price(input_data)
    print(f"{predicted_price:.2f} PLN")
