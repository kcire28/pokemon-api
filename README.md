# Pokedex API

This API allows managing data related to Pokémon and trainers, using MongoDB as the database.

## Configuration

The connection to MongoDB is remote and configured in the `server.js` file. Here is the connection URI:

```
mongodb+srv://kcire28ul:SglD1g0dpyFlk4zG@cluster0.mfasb1r.mongodb.net/pokedex?retryWrites=true&w=majority
```

Make sure to configure the URI in your development environment if necessary.

## Running the Project with Node.js

1. Install the project dependencies:
   ```bash
   npm install
   ```

2. To start the server, run the following command:
   ```bash
   node src/server.js
   ```

The server will run on port 5000 by default.

## Running Tests

To run the project tests, use the following command:
```bash
npm test
```

## Endpoints

### Pokemons

- **GET /pokemons/exclude/:trainerId**  
  Retrieve all Pokémon excluding those already associated with a given trainer.  
  **Parameters**: `trainerId` (path parameter) – The ID of the trainer.

- **GET /pokemons/sync**  
  Synchronize Pokémon data (e.g., update the Pokémon list or fetch new data).

- **GET /pokemons/external/:externalId**  
  Search for a Pokémon using an external identifier.  
  **Parameters**: `externalId` (path parameter) – The external ID of the Pokémon.

### Trainers

- **POST /trainers**  
  Create a new trainer.  
  **Body**: The trainer's data (e.g., name, email).

- **POST /trainers/add-favorites**  
  Add a Pokémon to a trainer's list of favorite Pokémon.  
  **Body**: The trainer's ID and the Pokémon's ID to be added.

- **POST /trainers/verify**  
  Verify if a trainer exists by their email address.  
  **Body**: The trainer's email.

- **GET /trainers/:trainerId/favorites**  
  Get the list of favorite Pokémon for a specific trainer.  
  **Parameters**: `trainerId` (path parameter) – The ID of the trainer.

- **DELETE /trainers/:trainerId/favorites**  
  Remove a Pokémon from a trainer's list of favorite Pokémon.  
  **Parameters**: `trainerId` (path parameter) – The ID of the trainer.  
  **Body**: The ID of the Pokémon to be removed.

