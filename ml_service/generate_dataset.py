import os
import random
import pandas as pd
import numpy as np

# Ensure data directory exists
os.makedirs("ml_service/data", exist_ok=True)

# Sample values
brands = {
    "Maruti Suzuki": ["Swift", "Baleno", "Breza", "Alto", "Dzire", "Ertiga"],
    "Hyundai": ["i20", "Creta", "Verna", "Grand i10", "Alcazar", "Tucson"],
    "Honda": ["City", "Civic", "Amaze", "Jazz", "WR-V"],
    "Toyota": ["Fortuner", "Innova", "Glanza", "Camry", "Corolla Altis"],
    "Mahindra": ["Thar", "XUV700", "Scorpio", "Bolero", "XUV300"],
    "Tata": ["Nexon", "Harrier", "Safari", "Altroz", "Punch", "Tiago"],
    "BMW": ["3 Series", "5 Series", "X1", "X5", "7 Series"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLA", "GLE", "S-Class"],
    "Audi": ["A4", "A6", "Q3", "Q5", "Q7"],
    "Tesla": ["Model 3", "Model Y", "Model S"]
}

brand_base_prices = {
    "Maruti Suzuki": 5.5,
    "Hyundai": 6.5,
    "Honda": 9.0,
    "Toyota": 15.0,
    "Mahindra": 11.0,
    "Tata": 8.0,
    "BMW": 42.0,
    "Mercedes-Benz": 48.0,
    "Audi": 40.0,
    "Tesla": 55.0
}

fuel_types = ["Petrol", "Diesel", "CNG", "Electric"]
transmissions = ["Manual", "Automatic"]
cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad"]

# Data generation settings (Scaled to 38,000 records)
num_rows = 38000
data = []

random.seed(42)
np.random.seed(42)

for i in range(num_rows):
    brand = random.choice(list(brands.keys()))
    model = random.choice(brands[brand])
    year = random.randint(2012, 2025)
    
    # Calculate base price
    base_price = brand_base_prices[brand]
    
    # Adjust for specific high-end models
    model_adj = 1.0
    if model in ["Fortuner", "Camry"]:
        model_adj = 2.2
    elif model in ["Innova"]:
        model_adj = 1.6
    elif model in ["XUV700", "Scorpio"]:
        model_adj = 1.5
    elif model in ["Thar"]:
        model_adj = 1.2
    elif model in ["Harrier", "Safari"]:
        model_adj = 1.8
    elif model in ["5 Series", "X5", "E-Class", "GLE", "A6", "Q5", "Q7", "Model Y", "Model S"]:
        model_adj = 1.8
    elif model in ["7 Series", "S-Class"]:
        model_adj = 2.5
    elif model in ["Alto", "Tiago", "Grand i10"]:
        model_adj = 0.7
        
    price = base_price * model_adj
    
    # Year depreciation: ~8% per year
    age = 2026 - year
    depreciation_rate = 0.08
    price = price * ((1 - depreciation_rate) ** age)
    
    # Kilometers driven: negative correlation
    if age == 0:
        km_driven = random.randint(1000, 8000)
    elif age == 1:
        km_driven = random.randint(5000, 20000)
    else:
        km_driven = random.randint(10000, 15000) * age + random.randint(-5000, 5000)
        km_driven = max(5000, km_driven)
        
    km_depreciation = (km_driven / 100000) * 0.12
    price = price * (1 - km_depreciation)
    
    # Fuel Type adjustments
    fuel = random.choice(fuel_types)
    if brand == "Tesla":
        fuel = "Electric"
        
    if fuel == "Diesel":
        price *= 1.08
    elif fuel == "CNG":
        price *= 0.90
    elif fuel == "Electric":
        price *= 1.15
        
    # Transmission adjustments
    transmission = random.choice(transmissions)
    if brand in ["BMW", "Mercedes-Benz", "Audi", "Tesla"] or model in ["Fortuner", "XUV700"]:
        transmission = "Automatic"
        
    if transmission == "Automatic":
        price *= 1.12
        
    # Owner adjustments
    owner_count = random.choices([1, 2, 3, 4], weights=[0.70, 0.22, 0.06, 0.02])[0]
    owner_depreciation = (owner_count - 1) * 0.07
    price = price * (1 - owner_depreciation)
    
    # Mileage: higher mileage (fuel economy)
    if brand in ["BMW", "Mercedes-Benz", "Audi", "Tesla"]:
        mileage = round(random.uniform(9.0, 15.0), 1) if fuel != "Electric" else round(random.uniform(350, 550), 1)
    elif fuel == "CNG":
        mileage = round(random.uniform(22.0, 31.0), 1)
    else:
        mileage = round(random.uniform(15.0, 24.0), 1)
        
    # Engine Capacity (cc)
    if brand == "Tesla" or fuel == "Electric":
        engine_capacity = 0
    elif brand in ["BMW", "Mercedes-Benz", "Audi"]:
        engine_capacity = random.choice([1998, 2993, 2998, 1984])
    elif model in ["Fortuner", "Innova"]:
        engine_capacity = random.choice([2694, 2755, 2393])
    elif model in ["Thar", "XUV700", "Scorpio"]:
        engine_capacity = random.choice([1997, 2184])
    else:
        engine_capacity = random.choice([998, 1197, 1497, 1498])
        
    # Seating Capacity
    if model in ["Ertiga", "Innova", "Fortuner", "Safari", "XUV700", "Scorpio", "Alcazar"]:
        seating_capacity = 7
    elif model in ["Alto", "Model S", "Model Y"]:
        seating_capacity = 5
    else:
        seating_capacity = random.choice([5, 7])
        if model in ["Swift", "Baleno", "i20"]:
            seating_capacity = 5
            
    # Safety Rating
    if brand in ["Tata", "Mahindra", "BMW", "Mercedes-Benz", "Audi", "Tesla", "Toyota"]:
        safety_rating = random.choices([4, 5], weights=[0.3, 0.7])[0]
    elif brand in ["Honda"]:
        safety_rating = random.choices([3, 4, 5], weights=[0.2, 0.5, 0.3])[0]
    else:
        safety_rating = random.choices([2, 3, 4], weights=[0.4, 0.4, 0.2])[0]
        
    # City/Location
    city = random.choice(cities)
    city_multipliers = {
        "Mumbai": 1.05, "Bangalore": 1.07, "Delhi": 0.98, "Hyderabad": 1.02,
        "Pune": 0.97, "Chennai": 1.00, "Kolkata": 0.94, "Ahmedabad": 0.95
    }
    price *= city_multipliers[city]
    
    # Car Health Score
    health_score = random.randint(65, 98)
    health_mult = 0.85 + (health_score - 65) / (98 - 65) * 0.25
    price *= health_mult
    
    # Cap selling price
    price = max(1.2, round(price, 2))
    
    # Maintenance Cost category
    if brand in ["BMW", "Mercedes-Benz", "Audi"]:
        maintenance_cost = "High"
    elif brand in ["Maruti Suzuki", "Hyundai"]:
        maintenance_cost = "Low"
    else:
        maintenance_cost = "Medium"

    # --- MrDheer's dataset features ---
    variants = ["LXI", "VXI", "ZXI", "Sport", "Luxury Line", "Performance", "Crysta", "Legender"]
    variant = random.choice(variants)
    ex_showroom = round(price * 1.15, 2)
    # Cylinders logic
    if fuel == "Electric":
        cylinders = 0
    elif engine_capacity > 2500:
        cylinders = 6
    elif engine_capacity > 1500:
        cylinders = 4
    else:
        cylinders = 3
        
    # Appending merged record
    data.append({
        "brand": brand,
        "model": model,
        "variant": variant,
        "year": year,
        "fuel_type": fuel,
        "transmission": transmission,
        "owner_count": owner_count,
        "km_driven": km_driven,
        "mileage": mileage,
        "engine_capacity": engine_capacity,
        "cylinders": cylinders,
        "seating_capacity": seating_capacity,
        "safety_rating": safety_rating,
        "city": city,
        "health_score": health_score,
        "maintenance_cost": maintenance_cost,
        "ex_showroom_price": ex_showroom,
        "selling_price": price
    })

df = pd.DataFrame(data)
df.to_csv("ml_service/data/used_cars_dataset.csv", index=False)
print(f"Dataset generated successfully with {len(df)} rows and saved to ml_service/data/used_cars_dataset.csv!")
