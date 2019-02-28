# Organization Relationships

## Requirements

- Docker & Docker Compose
- Linux (in order to use make and curl)

These guide assumes port 3000 is available. Port 3000 is utilized in further commands.

## How to use

Run tests
```
make test
```

Run app
```
make dev
```

Tear down docker compose deployment
```
make down
```

Create organization structure (check out body.json)
```
curl -H "Content-Type: application/json" --data @body.json localhost:3000/organization/
```

Retrieve organization relationships list
```
curl "localhost:3000/organization?org=Black%20Banana&page=1" | python -m json.tool
```

### Additional endpoints:
Flush database
```
curl -X DELETE localhost:3000/organization/
```

Generate random organization structure with N organizations (you'll see additional info in server's logs in console):
```
curl localhost:3000/organization/generate/10000
```

## Further improvements:

- input validation
