const API_KEY = "AIzaSyBaNiFKt4xIWLfihgRj0yyK69ilPVOe7rg";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=" + API_KEY;

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");

// Load chat history
document.addEventListener("DOMContentLoaded", () => {
    let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
    history.forEach(msg => addMessage(msg.text, msg.sender));
});

// Send button click
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") sendMessage();
});

// Speech-to-text (Voice Input)
micBtn.addEventListener("click", () => {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    
    recognition.onresult = function (event) {
        userInput.value = event.results[0][0].transcript;
        sendMessage();
    };

    recognition.onerror = function () {
        alert("Voice input failed, please try again.");
    };
});

function sendMessage() {
    let text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
    })
    .then(response => response.json())
    .then(data => {
        let reply = data.candidates?.[0]?.output || "I didn't understand that.";
        addMessage(reply, "bot");
    })
    .catch(error => {
        addMessage("Error: " + error.message, "bot");
    });
}

// Function to add chat message
function addMessage(text, sender) {
    let msgDiv = document.createElement("div");
    msgDiv.classList.add("chat", sender);
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Save chat history
    let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
    history.push({ text, sender });
    localStorage.setItem("chatHistory", JSON.stringify(history));
}
