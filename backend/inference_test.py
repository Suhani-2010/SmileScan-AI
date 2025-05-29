from inference_sdk import InferenceHTTPClient

# Initialize the client with your Roboflow API key
CLIENT = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="7jS7EjQz9pYi3KtDvqeF"
)

# Replace 'your_image.jpg' with the path to your actual image file
image_path = "your_image.jpeg"

# Run inference
result = CLIENT.infer(image_path, model_id="adr/6")

print("Prediction Result:")
print(result)

