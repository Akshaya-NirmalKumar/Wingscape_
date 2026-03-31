import json
import os
from copy import deepcopy
from pathlib import Path

import certifi
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()


class LocalInsertOneResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class LocalInsertManyResult:
    def __init__(self, inserted_ids):
        self.inserted_ids = inserted_ids


class LocalJsonDatabase:
    def __init__(self, file_path, name="backenddb"):
        self.file_path = Path(file_path)
        self.name = name
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.file_path.exists():
            self.file_path.write_text("{}", encoding="utf-8")

    def _load(self):
        try:
            return json.loads(self.file_path.read_text(encoding="utf-8") or "{}")
        except json.JSONDecodeError:
            return {}

    def _save(self, data):
        self.file_path.write_text(json.dumps(data, indent=2), encoding="utf-8")

    def list_collection_names(self):
        return list(self._load().keys())

    def __getitem__(self, collection_name):
        return LocalCollection(self, collection_name)


class LocalCollection:
    def __init__(self, database, name):
        self.database = database
        self.name = name

    def _read_docs(self):
        data = self.database._load()
        return data.get(self.name, [])

    def _write_docs(self, docs):
        data = self.database._load()
        data[self.name] = docs
        self.database._save(data)

    def _deserialize_doc(self, doc):
        parsed = deepcopy(doc)
        if "_id" in parsed:
            parsed["_id"] = ObjectId(parsed["_id"])
        return parsed

    def _serialize_doc(self, doc):
        parsed = deepcopy(doc)
        if "_id" in parsed:
            parsed["_id"] = str(parsed["_id"])
        return parsed

    def _matches(self, doc, query):
        if not query:
            return True

        for key, expected in query.items():
            if key == "$or":
                return any(self._matches(doc, option) for option in expected)

            actual = doc.get(key)

            if isinstance(expected, dict):
                if "$regex" in expected:
                    regex_value = str(expected["$regex"]).lower()
                    actual_value = str(actual or "")
                    if regex_value not in actual_value.lower():
                        return False
                    continue

                return False

            if key == "_id":
                if str(actual) != str(expected):
                    return False
                continue

            if str(actual) != str(expected) if isinstance(expected, ObjectId) else actual != expected:
                return False

        return True

    def find_one(self, query=None, projection=None):
        for doc in self._read_docs():
            parsed = self._deserialize_doc(doc)
            if self._matches(parsed, query or {}):
                if projection:
                    return self._apply_projection(parsed, projection)
                return parsed
        return None

    def find(self, query=None):
        matches = []
        for doc in self._read_docs():
            parsed = self._deserialize_doc(doc)
            if self._matches(parsed, query or {}):
                matches.append(parsed)
        return matches

    def insert_one(self, document):
        docs = self._read_docs()
        parsed = deepcopy(document)
        inserted_id = parsed.get("_id", ObjectId())
        parsed["_id"] = inserted_id
        docs.append(self._serialize_doc(parsed))
        self._write_docs(docs)
        return LocalInsertOneResult(inserted_id)

    def insert_many(self, documents):
        inserted_ids = []
        docs = self._read_docs()
        for document in documents:
            parsed = deepcopy(document)
            inserted_id = parsed.get("_id", ObjectId())
            parsed["_id"] = inserted_id
            inserted_ids.append(inserted_id)
            docs.append(self._serialize_doc(parsed))
        self._write_docs(docs)
        return LocalInsertManyResult(inserted_ids)

    def update_one(self, query, update):
        docs = self._read_docs()
        updated = False

        for index, doc in enumerate(docs):
            parsed = self._deserialize_doc(doc)
            if not self._matches(parsed, query):
                continue

            if "$set" in update:
                for key, value in update["$set"].items():
                    parsed[key] = value

            if "$inc" in update:
                for key, value in update["$inc"].items():
                    parsed[key] = parsed.get(key, 0) + value

            docs[index] = self._serialize_doc(parsed)
            updated = True
            break

        if updated:
            self._write_docs(docs)

    def delete_many(self, query):
        if not query:
            self._write_docs([])
            return

        docs = self._read_docs()
        filtered = [
            doc for doc in docs
            if not self._matches(self._deserialize_doc(doc), query)
        ]
        self._write_docs(filtered)

    def count_documents(self, query):
        return len(self.find(query))

    def _apply_projection(self, doc, projection):
        projected = deepcopy(doc)
        for key, include in projection.items():
            if include == 0 and key in projected:
                projected.pop(key, None)
        return projected


class LocalJsonClient:
    def __init__(self, file_path):
        self._db = LocalJsonDatabase(file_path)
        self.admin = self

    def command(self, name):
        if name == "ping":
            return {"ok": 1}
        raise ValueError(f"Unsupported command: {name}")

    def __getitem__(self, db_name):
        self._db.name = db_name
        return self._db


def create_client():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://database:27017/")

    try:
        mongo_client = MongoClient(
            mongo_uri,
            tlsCAFile=certifi.where(),
            server_api=ServerApi("1"),
            serverSelectionTimeoutMS=5000,
        )
        mongo_client.admin.command("ping")
        return mongo_client, mongo_client["backenddb"]
    except Exception as exc:
        print(f"MongoDB unavailable, using local fallback store: {exc}")
        fallback_path = Path(__file__).with_name("localdb.json")
        local_client = LocalJsonClient(fallback_path)
        return local_client, local_client["backenddb"]


client, db = create_client()

users_collection = db["users"]
destinations_collection = db["destinations"]
flights_collection = db["flights"]
bookings_collection = db["bookings"]
price_alerts_collection = db["price_alerts"]
airports_collection = db["airports"]


def get_db():
    return db
