import requests
import json
import sys

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    url = "http://127.0.0.1:8000/strategy"
    
    # Simple live match state payload
    payload = {
        "innings": 2,
        "over": 15.2,
        "score": 118,
        "wickets": 5,
        "target": 168,
        "batting_team": "Mumbai Indians",
        "bowling_team": "Chennai Super Kings",
        "striker": "Hardik Pandya",
        "non_striker": "Krunal Pandya",
        "pitch": "turning",
        "dew": "low",
        "powerplay": False,
        "death_overs": False,
        "impact_player_available": True,
        "bowlers": [
            {"name": "Ravindra Jadeja", "overs_used": 3.0, "type": "spin"},
            {"name": "Matheesha Pathirana", "overs_used": 1.2, "type": "pace"},
            {"name": "Deepak Chahar", "overs_used": 3.0, "type": "pace"},
            {"name": "Mitchell Santner", "overs_used": 2.0, "type": "spin"}
        ]
    }
    
    print(f"Sending POST request to {url}...")
    try:
        response = requests.post(url, json=payload, timeout=120)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Save the full API response JSON
            with open("api_response.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print("\n✅ Full API response successfully saved to api_response.json!")
            
            print("\n--- Match Stats ---")
            print(json.dumps(data["stats"], indent=2))
            
            print("\n--- Commentator Explainer Output ---")
            print(data["final_output"])
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    main()
