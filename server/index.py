import asyncio
from websockets.server import serve

async def echo(websocket):
    async for message in websocket:
        await websocket.send(message)

async def main():
    async with serve(echo, "localhost", 4444):
        await asyncio.Future()

print("starting server")
asyncio.run(main())
