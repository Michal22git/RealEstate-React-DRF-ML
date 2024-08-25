import joblib
import pandas as pd


model = joblib.load('apartment_price_model.joblib')

def get_user_input():
    data = {
        "city": "wroclaw",
        "type": "blockOfFlats",
        "squareMeters": 52.0,
        "rooms": 2.0,
        "floor": 1.0,
        "floorCount": 4.0,
        "buildYear": 2018,
        "latitude": 51.094824,
        "longitude": 16.990635,
        "centreDistance": 2.1,
        "poiCount": 35,
        "ownership": "condominium",
        "condition": "low",
        "hasParkingSpace": 0,
        "hasBalcony": 1,
        "hasElevator": 0,
        "hasSecurity": 0,
        "hasStorageRoom": 0
    }


    return pd.DataFrame([data])


def predict_price(input_data):
    prediction = model.predict(input_data)
    return prediction[0]


if __name__ == "__main__":
    input_data = get_user_input()
    predicted_price = predict_price(input_data)
    print(f"{predicted_price:.2f} PLN")
