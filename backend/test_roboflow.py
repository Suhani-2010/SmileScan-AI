import requests

def test_roboflow():
    url = "https://serverless.roboflow.com/adr/6"
    params = {
        "api_key": "7jS7EjQz9pYi3KtDvqeF",
        "disable_active_learning": "False"
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()  # Raises HTTPError for bad responses
        print("Roboflow API Response status:", response.status_code)
        print("Roboflow API Response:", response.text[:200])  # print first 200 chars
    except requests.exceptions.SSLError as ssl_err:
        print("Roboflow SSL error:", ssl_err)
    except requests.exceptions.RequestException as e:
        print("Roboflow Request error:", e)

if __name__ == "__main__":
    test_roboflow()

