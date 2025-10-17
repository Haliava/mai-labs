import json
import sys
import os
from pathlib import Path

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Get absolute path to the target directory
target_dir = Path(__file__).resolve().parent.parent / "apps"

# Now import normally
from apps.main import app

schema = app.openapi()
with open("openapi.json", "w") as f:
    json.dump(schema, f, indent=2)