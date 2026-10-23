"""Write docs/spinitron.json from spinitron.yaml. Keeps $ref as $ref."""
import json
from pathlib import Path

import yaml

root = Path(__file__).resolve().parent
data = yaml.safe_load((root / "spinitron.yaml").read_text(encoding="utf-8"))
out = root / "docs" / "spinitron.json"
out.write_text(
    json.dumps(data, indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8",
    newline="\n",
)
