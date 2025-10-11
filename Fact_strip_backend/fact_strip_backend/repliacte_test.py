import os
import replicate

# Check for token
if not os.getenv("REPLICATE_API_TOKEN"):
    print("❌ Replicate API Token missing!")
else:
    print("✅ Replicate API Token found")

# Run model test
output = replicate.run(
    "stability-ai/sdxl:5c39c305ee606919cfb87f1c79f4d9cf",
    input={"prompt": "a futuristic city skyline at sunset"}
)

# Print the actual image URL(s)
if isinstance(output, list):
    print("✅ Image URL(s):")
    for url in output:
        print(url)
else:
    print("Output:", output)
