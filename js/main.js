
import {
    startGame,
    stopTimer,
    getElapsedSeconds,
    getCurrentCardNumber,
    setEndGameCallback
} from "./game.js";

import {
    showModal,
    showGame,
    showRegistration,
    loadRanking
} from "./ui.js";

import {
    registerOrUpdateUser,
    getCurrentUser,
    saveRanking
} from "./firebase.js";

// HTML elements
const userForm = document.getElementById("user-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");

const gameForm = document.getElementById("game-form");
const cardsNumberInput = document.getElementById("cards-number");
const playButton = document.getElementById("play-btn");
const logoutButton = document.getElementById("logout-btn");

// Check whether a user session exists
async function checkSession() {
    const userId = sessionStorage.getItem("user");

    if (userId) {
        showGame();
        await loadRanking();
    } else {
        showRegistration();
    }
}

// Validate the number of cards
function validateCardsNumber(number) {
    if (
        !Number.isInteger(number) ||
        number < 2 ||
        number % 2 !== 0 ||
        number > 302
    ) {
        showModal(
            "Please enter an even number of cards between 2 and 302."
        );

        return false;
    }

    return true;
}

// Register user
async function registerUser(event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();

    if (!username || !email) {
        showModal("Please complete all the fields.");
        return;
    }

    const submitButton = userForm.querySelector(
        "button[type='submit']"
    );

    submitButton.disabled = true;

    try {
        const userId = await registerOrUpdateUser(username, email);

        sessionStorage.setItem("user", userId);
        showGame();
        await loadRanking();
        
    } catch (error) {
        console.error("Registration error:", error);
        showModal("Something went wrong. Please try again.");
    } finally {
        submitButton.disabled = false;
    }
}

// Handle game form submission
async function handleGameSubmit(event) {
    event.preventDefault();

    const numberOfCards = Number(cardsNumberInput.value);

    if (!validateCardsNumber(numberOfCards)) {
        return;
    }

    playButton.textContent = "Volver a jugar";

    await startGame(numberOfCards);
}

// End the game and save the ranking record
async function endGame() {
    stopTimer();

    showModal(
        `Congratulations! You completed the game in ${getElapsedSeconds()} seconds.`
    );

    try {
        const userId = sessionStorage.getItem("user");
        const user = await getCurrentUser(userId);

        // Save the completed game
        const newRecord = await saveRanking({
            userId,
            username: user.username,
            email: user.email,
            time: getElapsedSeconds(),
            cardsNumber: getCurrentCardNumber()
        });

        await loadRanking(newRecord.name);

    } catch (error) {
        console.error("Ranking error:", error);

        showModal(
            "The game is finished, but the ranking could not be saved."
        );
    }
}

// Connect the game completion callback
setEndGameCallback(endGame);

// Log out the current user
function logout() {
    stopTimer();

    sessionStorage.removeItem("user");

    window.location.reload();
}

// Event listeners
userForm.addEventListener("submit", registerUser);
gameForm.addEventListener("submit", handleGameSubmit);

modalClose.addEventListener("click", () => {
    modal.close();
});

logoutButton.addEventListener("click", logout);

// Check the session when the page loads
checkSession();
