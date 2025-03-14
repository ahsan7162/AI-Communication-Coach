response_schema = {
    "type": "array",  # Use lowercase "array"
    "items": {
        "type": "object",  # Use lowercase "object"
        "properties": {
            "updated_profile": {
                "type": "object",
                "additionalProperties": {"type": "string"}  # Matches Dict[str, str]
            }
        },
        "required": ["updated_profile"]
    }
}