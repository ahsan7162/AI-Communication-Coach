from enum import Enum

class MessageTypeEnum(str, Enum):
    HUMAN = "human"
    AICOACH = "aicoach"