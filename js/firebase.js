
import { FIREBASE_URL } from "./config.js";

// Register a new user or update an existing user
export async function registerOrUpdateUser(username, email) {
    // Retrieve existing users
    const response = await fetch(`${FIREBASE_URL}/users.json`);

    if (!response.ok) {
        throw new Error("Could not retrieve users.");
    }

    const users = await response.json();

    // Check whether the email already exists
    const existingUser = Object.entries(users ?? {}).find(
        ([, user]) => user.email?.toLowerCase() === email
    );

    let userId;

    if (existingUser) {
        // Update the existing username
        userId = existingUser[0];

        const updateResponse = await fetch(
            `${FIREBASE_URL}/users/${userId}.json`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username })
            }
        );

        if (!updateResponse.ok) {
            throw new Error("Could not update the user.");
        }
    } else {
        // Create a new user
        const createResponse = await fetch(
            `${FIREBASE_URL}/users.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email
                })
            }
        );

        if (!createResponse.ok) {
            throw new Error("Could not create the user.");
        }

        const newUser = await createResponse.json();
        userId = newUser.name;
    }

    return userId;
}

// Retrieve the current user
export async function getCurrentUser(userId) {
    const response = await fetch(
        `${FIREBASE_URL}/users/${userId}.json`
    );

    if (!response.ok) {
        throw new Error("Could not retrieve current user.");
    }

    return response.json();
}

// Save a completed game to the ranking
export async function saveRanking(record) {
    const response = await fetch(`${FIREBASE_URL}/ranking.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(record)
    });

    if (!response.ok) {
        throw new Error("Could not save ranking.");
    }

    return response.json();
}