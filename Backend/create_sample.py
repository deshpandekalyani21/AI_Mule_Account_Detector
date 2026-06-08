import pandas as pd

df = pd.read_csv("../Datasets/selected_features_dataset.csv")

# Remove target column
sample = df.drop(columns=["F3924"]).head(5)

sample.to_csv("../Datasets/sample_test.csv", index=False)

print("sample_test.csv created successfully")