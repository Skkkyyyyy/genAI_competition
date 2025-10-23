import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8000"


def check_server():
    """Check if server is running"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=2)
        return True
    except:
        return False


def wait_for_server():
    """Wait for server to start with timeout"""
    print("⏳ Waiting for server to start...", end="", flush=True)

    for i in range(30):  # Wait up to 30 seconds
        if check_server():
            print(" ✅")
            return True
        print(".", end="", flush=True)
        time.sleep(1)

    print(" ❌")
    return False


def test_all_endpoints():
    """Test all API endpoints"""
    print("\n🧪 Testing endpoints...")

    # Test root
    try:
        response = requests.get(BASE_URL)
        print(f"✅ GET / - Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ GET / failed: {e}")
        return False

    # Test health
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ GET /health - Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ GET /health failed: {e}")
        return False

    # Test chat endpoint
    try:
        test_data = {"prompt": "Hello from test client!"}
        response = requests.post(f"{BASE_URL}/llm/chat", json=test_data)
        print(f"✅ POST /llm/chat - Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ POST /llm/chat failed: {e}")
        return False

    return True

def call_chatbot(prompt:str):
    bot_prompt = {"prompt": prompt}
    response = requests.post(f"{BASE_URL}/llm/chat", json=bot_prompt)
    print(response.json())

def main():
    print("🚀 FastAPI Client Tester")
    print("=" * 50)

    if not wait_for_server():
        print("\n❌ SERVER IS NOT RUNNING!")
        print("\n💡 SOLUTION: Please run this command in a SEPARATE terminal:")
        print("   python test_server.py")
        print("\nThen run this test script again.")
        sys.exit(1)

    print("\n🎯 Server is running! Starting tests...")

    # if test_all_endpoints():
    #     print("\n🎉 ALL TESTS PASSED! Your API is working correctly.")
    # else:
    #     print("\n💥 Some tests failed.")

    call_chatbot(input())



if __name__ == "__main__":
    main()