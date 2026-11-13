
import { showModal } from "./ui.js";

// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

let timerInterval = null;
let elapsedSeconds = 0;
let currentCardNumber = 0;

// HTML elements
const gameBoard = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const playButton = document.getElementById("play-btn");

// Callback to notify main.js when the game ends
let endGameCallback = null;

export function setEndGameCallback(callback) {
    endGameCallback = callback;
}

// Retrieve one Pokémon from PokeAPI
export async function getPokemon(id) {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${id}`
    );

    if (!response.ok) {
        throw new Error("Could not retrieve Pokémon data.");
    }

    const pokemon = await response.json();

    return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.front_default
    };
}

// Retrieve different random Pokémon
export async function getRandomPokemon(numberOfPairs) {
    const pokemonIds = new Set();

    while (pokemonIds.size < numberOfPairs) {
        const randomId = Math.floor(Math.random() * 151) + 1;
        pokemonIds.add(randomId);
    }

    const pokemonPromises = [...pokemonIds].map(
        (id) => getPokemon(id)
    );

    return Promise.all(pokemonPromises);
}

// Duplicate and shuffle the Pokémon cards
export function createShuffledCards(pokemonList) {
    const duplicatedCards = [...pokemonList, ...pokemonList];

    for (let i = duplicatedCards.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [duplicatedCards[i], duplicatedCards[randomIndex]] =
            [duplicatedCards[randomIndex], duplicatedCards[i]];
    }

    return duplicatedCards;
}

// Display the cards on the board
function displayCards() {
    gameBoard.innerHTML = "";

    cards.forEach((pokemon) => {
        const card = document.createElement("div");

        card.classList.add("card");
        card.dataset.id = pokemon.id;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Face-down Pokémon card");
        card.setAttribute("tabindex", "0");

        card.addEventListener("click", () => {
            flipCard(card, pokemon);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                flipCard(card, pokemon);
            }
        });

        gameBoard.appendChild(card);
    });
}

// Flip a card
function flipCard(card, pokemon) {
    if (
        lockBoard ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    card.classList.add("flipped");
    card.style.backgroundImage = `url("${pokemon.image}")`;
    card.setAttribute("aria-label", pokemon.name);

    flippedCards.push({
        element: card,
        pokemon
    });

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// Check whether two cards match
function checkMatch() {
    const firstCard = flippedCards[0];
    const secondCard = flippedCards[1];

    if (firstCard.pokemon.id === secondCard.pokemon.id) {
        firstCard.element.classList.add("matched");
        secondCard.element.classList.add("matched");

        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === currentCardNumber / 2) {
            stopTimer();

            if (endGameCallback) {
                endGameCallback();
            }
        }
    } else {
        lockBoard = true;

        setTimeout(() => {
            firstCard.element.classList.remove("flipped");
            secondCard.element.classList.remove("flipped");

            firstCard.element.style.backgroundImage = "";
            secondCard.element.style.backgroundImage = "";

            firstCard.element.setAttribute(
                "aria-label",
                "Face-down Pokémon card"
            );

            secondCard.element.setAttribute(
                "aria-label",
                "Face-down Pokémon card"
            );

            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }
}

// Start the game timer
function startTimer() {
    elapsedSeconds = 0;
    timerDisplay.textContent = "0m 0s";

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        elapsedSeconds++;

        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;

        timerDisplay.textContent = `${minutes}m ${seconds}s`;
    }, 1000);
}

// Stop the game timer
export function stopTimer() {
    clearInterval(timerInterval);
}

// Start a new game
export async function startGame(numberOfCards) {
    playButton.disabled = true;

    try {
        stopTimer();

        flippedCards = [];
        matchedPairs = 0;
        lockBoard = false;
        currentCardNumber = numberOfCards;

        gameBoard.innerHTML = "";
        timerDisplay.textContent = "Loading Pokémon...";

        const numberOfPairs = numberOfCards / 2;

        const pokemonList = await getRandomPokemon(numberOfPairs);

        cards = createShuffledCards(pokemonList);

        displayCards();
        startTimer();

    } catch (error) {
        console.error("Error starting game:", error);

        timerDisplay.textContent = "0m 0s";

        showModal("Could not start the game. Please try again.");
    } finally {
        playButton.disabled = false;
    }
}

// Get the elapsed time
export function getElapsedSeconds() {
    return elapsedSeconds;
}

// Get the number of cards in the current game
export function getCurrentCardNumber() {
    return currentCardNumber;
}
