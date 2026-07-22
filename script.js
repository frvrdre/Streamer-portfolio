// Bansky RL TikTok site config

const TIKTOK_HANDLE = "bansky.rl";
const TIKTOK_PROFILE_URL = `https://www.tiktok.com/@${TIKTOK_HANDLE}`;
const TIKTOK_LIVE_URL = `https://www.tiktok.com/@${TIKTOK_HANDLE}/live`;

// Change this to false if you want the live panel to show offline styling.
const isLive = true;

// Live status feature

const livePreview = document.querySelector(".live-preview");
const liveStatusText = document.querySelector(".live-top p");
const liveTitle = document.querySelector(".live-info h3");
const liveButtons = document.querySelectorAll(".live-info .button, .nav-button");

function updateLiveStatus() {
  if (!livePreview || !liveStatusText || !liveTitle) {
    return;
  }

  if (isLive === true) {
    livePreview.classList.add("is-live");
    livePreview.classList.remove("is-offline");

    liveStatusText.textContent = "TIKTOK LIVE";
    liveTitle.textContent = "Bansky is live on TikTok";

    liveButtons.forEach(function (button) {
      if (button.textContent.toLowerCase().includes("live") || button.classList.contains("nav-button")) {
        button.href = TIKTOK_LIVE_URL;
      }
    });
  } else {
    livePreview.classList.remove("is-live");
    livePreview.classList.add("is-offline");

    liveStatusText.textContent = "OFFLINE";
    liveTitle.textContent = "Bansky is offline";

    liveButtons.forEach(function (button) {
      if (button.textContent.toLowerCase().includes("live") || button.classList.contains("nav-button")) {
        button.href = TIKTOK_PROFILE_URL;
      }
    });
  }
}

updateLiveStatus();

// Clip and edit filter feature

const controlGroups = document.querySelectorAll(".clip-controls");

controlGroups.forEach(function (group) {
  const buttons = group.querySelectorAll("button");
  const section = group.closest("section");
  const cards = section ? section.querySelectorAll(".clip-card") : [];

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.dataset.filter;

      buttons.forEach(function (otherButton) {
        otherButton.classList.remove("active");
      });

      button.classList.add("active");

      cards.forEach(function (card) {
        const cardCategory = card.dataset.category;

        if (selectedCategory === "all" || cardCategory === selectedCategory) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  if (buttons.length > 0) {
    buttons[0].classList.add("active");
  }
});

// TikTok clip modal feature

const clipCards = document.querySelectorAll(".clip-card");
const clipModal = document.querySelector("#clipModal");
const clipFrame = document.querySelector("#clipFrame");
const closeModalButton = document.querySelector(".close-modal-button");

function extractTikTokVideoId(url) {
  if (!url) {
    return "";
  }

  const match = url.match(/\/video\/(\d+)/);

  if (!match) {
    return "";
  }

  return match[1];
}

function openClipModal(videoId) {
  if (!clipModal || !clipFrame || !videoId) {
    return;
  }

  clipFrame.src = `https://www.tiktok.com/player/v1/${videoId}?autoplay=1`;
  clipModal.classList.add("show");
  clipModal.setAttribute("aria-hidden", "false");
}

function closeClipModal() {
  if (!clipModal || !clipFrame) {
    return;
  }

  clipModal.classList.remove("show");
  clipModal.setAttribute("aria-hidden", "true");
  clipFrame.src = "";
}

function handleCardClick(card) {
  const explicitVideoId = card.dataset.tiktokId || "";
  const tiktokUrl = card.dataset.tiktokUrl || TIKTOK_PROFILE_URL;
  const detectedVideoId = extractTikTokVideoId(tiktokUrl);
  const finalVideoId = explicitVideoId || detectedVideoId;

  // If you add a real TikTok video link like:
  // https://www.tiktok.com/@bansky.rl/video/1234567890123456789
  // this will open the video in the popup player.
  if (finalVideoId) {
    openClipModal(finalVideoId);
    return;
  }

  // If no exact clip URL has been added yet, open the TikTok profile.
  window.open(tiktokUrl, "_blank", "noopener,noreferrer");
}

clipCards.forEach(function (card) {
  card.addEventListener("click", function () {
    handleCardClick(card);
  });
});

if (closeModalButton) {
  closeModalButton.addEventListener("click", closeClipModal);
}

if (clipModal) {
  clipModal.addEventListener("click", function (event) {
    if (event.target === clipModal) {
      closeClipModal();
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeClipModal();
  }
});
