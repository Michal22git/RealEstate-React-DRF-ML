import joblib
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


class ApartmentPriceModel:
    def __init__(self, file_paths):
        self.file_paths = file_paths
        self.model = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None

    def load_data(self):
        dataframes = [pd.read_csv(file_path) for file_path in self.file_paths]
        data = pd.concat(dataframes, ignore_index=True)
        return data

    def preprocess_data(self, data):
        if 'id' in data.columns:
            data = data.drop('id', axis=1)

        bool_columns = ['hasParkingSpace', 'hasBalcony', 'hasElevator', 'hasSecurity', 'hasStorageRoom']
        for col in bool_columns:
            data[col] = data[col].fillna('no').map({'yes': 1, 'no': 0})

        data = data.drop(columns=[
            'schoolDistance', 'clinicDistance', 'postOfficeDistance',
            'kindergartenDistance', 'restaurantDistance', 'collegeDistance',
            'pharmacyDistance', 'buildingMaterial'
        ])

        numeric_columns = ['squareMeters', 'rooms', 'floor', 'floorCount', 'buildYear', 'latitude', 'longitude',
                           'centreDistance', 'poiCount']
        for col in numeric_columns:
            data[col] = pd.to_numeric(data[col], errors='coerce')

        X = data.drop('price', axis=1)
        y = data['price']
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    def create_preprocessor(self):
        numeric_features = ['squareMeters', 'rooms', 'floor', 'floorCount', 'buildYear', 'latitude', 'longitude',
                            'centreDistance', 'poiCount']
        bool_features = ['hasParkingSpace', 'hasBalcony', 'hasElevator', 'hasSecurity', 'hasStorageRoom']
        categorical_features = ['city', 'type', 'ownership', 'condition']

        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
        ])
        bool_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='most_frequent')),
        ])
        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])

        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, numeric_features),
                ('bool', bool_transformer, bool_features),
                ('cat', categorical_transformer, categorical_features)
            ])
        return preprocessor

    def create_model(self):
        preprocessor = self.create_preprocessor()
        self.model = Pipeline(steps=[('preprocessor', preprocessor),
                                     ('regressor', LinearRegression())])

    def train_model(self):
        self.model.fit(self.X_train, self.y_train)

    def evaluate_model(self):
        y_pred = self.model.predict(self.X_test)
        mse = mean_squared_error(self.y_test, y_pred)
        r2 = r2_score(self.y_test, y_pred)
        return mse, r2

    def save_model(self, filename):
        joblib.dump(self.model, filename)

    def test_model(self):
        sample = self.X_test.sample(n=5, random_state=42)
        predictions = self.model.predict(sample)

        for i, (index, row) in enumerate(sample.iterrows()):
            print(row.to_dict())
            print(f"{predictions[i]:.2f} PLN")
            print()

    def plot_actual_vs_predicted(self):
        """Model plot with actual and predicted prices."""
        y_pred = self.model.predict(self.X_test)
        plt.scatter(self.y_test, y_pred, alpha=0.5)
        plt.xlabel("Actual Prices")
        plt.ylabel("Predicted Prices")
        plt.title("Actual vs Predicted Prices")
        plt.plot([self.y_test.min(), self.y_test.max()], [self.y_test.min(), self.y_test.max()], 'r--', lw=2)
        plt.tight_layout()
        plt.savefig('model_plot.png')
        plt.close()

    def run(self):
        data = self.load_data()
        self.preprocess_data(data)
        self.create_model()
        self.train_model()

        mse, r2 = self.evaluate_model()
        print(f"mse: {mse}")
        print(f"r2: {r2}")

        self.plot_actual_vs_predicted()
        self.save_model('apartment_price_model.joblib')
        self.test_model()


if __name__ == "__main__":
    file_paths = [
        'data/apartments_pl_2024_03.csv',
        'data/apartments_pl_2024_04.csv',
        'data/apartments_pl_2024_05.csv',
        'data/apartments_pl_2024_06.csv'
    ]

    model = ApartmentPriceModel(file_paths)
    model.run()