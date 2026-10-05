import requests
import json
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept-Language": "en-IN,en;q=0.9",
}

query = "healthcare clinics in Bengaluru Urban Karnataka"
url = f"https://www.google.com/search?q={requests.utils.quote(query)}&tbm=lcl"

print(f"Testing free query: {query}")
resp = requests.get(url, headers=headers)
print(f"Status code: {resp.status_code}")

phones = re.findall(r"(?:(?:\+91|0)?\s?[6-9]\d{4}\s?\d{5})", resp.text)
print(f"Extracted phone patterns found: {len(phones)}")
for p in set(phones[:5]):
    print("Found phone:", p)
