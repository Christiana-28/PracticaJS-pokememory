import { FIREBASE_URL } from "./config.js";

// HTML elements
const registrationSection = document.getElementById("registration");
const gameSection = document.getElementById("game");

const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");

// Display a message in the modal
export function showModal(message) {
    modalMessage.textContent = message;
    modal.showModal();
}

// Display the game and hide registration
export function showGame() {
    registrationSection.hidden = true;
    registrationSection.style.display = "none";

    gameSection.hidden = false;
    gameSection.style.display = "flex";
}

// Display registration and hide the game
export function showRegistration() {
    gameSection.hidden = true;
    gameSection.style.display = "none";

    registrationSection.hidden = false;
    registrationSection.style.display = "block";
}

// Create a ranking table row
export function createRankingRow(record, position, highlightId) {
    const row = document.createElement("tr");

    const values = [
        position,
        record.username,
        record.email,
        `${record.time}s`,
        record.cardsNumber
    ];

    values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    if (record.id === highlightId) {
        row.classList.add("highlight");
    }

    return row;
}

// Create an ellipsis row
export function createEllipsisRow() {
    const row = document.createElement("tr");
    row.classList.add("ellipsis-row");

    const cell = document.createElement("td");
    cell.textContent = "...";
    cell.colSpan = 5;

    row.appendChild(cell);

    return row;
}

// Load and display the ranking
export async function loadRanking(highlightId = null) {
    const rankingContainer = document.getElementById("ranking");

    try {
        const response = await fetch(`${FIREBASE_URL}/ranking.json`);

        if (!response.ok) {
            throw new Error("Could not retrieve ranking.");
        }

        const rankingData = await response.json();

        const records = Object.entries(rankingData ?? {}).map(
            ([id, record]) => ({
                id,
                ...record
            })
        );

        // Sort by number of cards descending, then time ascending
        records.sort((a, b) => {
            if (b.cardsNumber !== a.cardsNumber) {
                return b.cardsNumber - a.cardsNumber;
            }

            return a.time - b.time;
        });

        rankingContainer.innerHTML = "";

        const table = document.createElement("table");

        const headings = [
            "Posición",
            "Username",
            "Mail",
            "Tiempo",
            "Número de cartas"
        ];

        const headerRow = document.createElement("tr");

        headings.forEach((heading) => {
            const th = document.createElement("th");
            th.textContent = heading;
            headerRow.appendChild(th);
        });

        table.appendChild(headerRow);

        if (records.length <= 5) {
            records.forEach((record, index) => {
                const row = createRankingRow(
                    record,
                    index + 1,
                    highlightId
                );

                table.appendChild(row);
            });
        } else {
            records.slice(0, 4).forEach((record, index) => {
                const row = createRankingRow(
                    record,
                    index + 1,
                    highlightId
                );

                table.appendChild(row);
            });

            const highlightedIndex = records.findIndex(
                (record) => record.id === highlightId
            );

            if (highlightedIndex >= 5) {
                table.appendChild(createEllipsisRow());

                const row = createRankingRow(
                    records[highlightedIndex],
                    highlightedIndex + 1,
                    highlightId
                );

                table.appendChild(row);
                table.appendChild(createEllipsisRow());
            } else {
                table.appendChild(createEllipsisRow());
            }
        }

        rankingContainer.appendChild(table);

    } catch (error) {
        console.error("Ranking error:", error);
        rankingContainer.textContent = "Could not load ranking.";
    }
}