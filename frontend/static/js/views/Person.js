import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Person");
  }

  async getPersonData() {
    try {
      const response = await axios.get(
        "https://api.gameofthronesquotes.xyz/v1/characters"
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async getRandomQuotes(slug) {
    try {
      const response = await axios.get(
        `https://api.gameofthronesquotes.xyz/v1/character/${slug}`
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getHtml() {
    let result = "";
    const person = await this.getPersonData().then((res) => res.data);
    person.map((item, index) => {
      result += `<div data-modal-trigger="modal-${index}" class="PersonMembers">
          <h5>${item.name}</h5>
        </div>`;
    });
    const modals = person
      .map(
        (
          item,
          index
        ) => `     
         <div class="modal" id="modal-${index}" data-slug="${
          item.slug
        }">
        <div class="modal-bg modal-exit"></div>
        <div class="modal-container">
          <h3>${item.name}</h3>
         ${item.house ? `<h4>${item.house.name}</h4` : ""}
          <ul><li>${item.quotes[0]}</li></ul>
          <button id="replaceQuotes">Replace quotes</button>
          <button class="modal-close modal-exit">close</button>
        </div>
      </div>`
      )
      .join("");

    return `
      <div class="personContainer">${result}</div>
      ${modals}
    `;
  }
  async handleModal() {
    const modalTriggers = document.querySelectorAll("[data-modal-trigger]");
    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", async () => {
        const modalId = trigger.getAttribute("data-modal-trigger");
        const modal = document.getElementById(modalId);
        const replaceQuotesButton = modal.querySelector("#replaceQuotes");
        replaceQuotesButton.addEventListener("click", async (event) => {
          event.preventDefault();

          try {
            const slug = modal.getAttribute("data-slug");
            const newQuote = await this.getRandomQuotes(slug).then(
              (res) => res.data[0].quotes
            );
            const modalContainer = modal.querySelector(".modal-container");
            const quoteElement = modalContainer.querySelector("li");
           const quoteLength = newQuote.length;
           const randomIndex = Math.floor(Math.random() * quoteLength);
            quoteElement.innerHTML= newQuote[randomIndex];
            console.log(newQuote[randomIndex]);
          } catch (error) {
            console.error("Error fetching new quote:", error);
          }
        });
        const exits = modal.querySelectorAll(".modal-exit");
        exits.forEach(function (exit) {
          exit.addEventListener("click", function (event) {
            event.preventDefault();
            modal.classList.remove("open");
          });
        });
        // Show the modal
        modal.classList.add("open");
      });
    });
  }

  async executeViewScript() {
    await this.handleModal();
  }
}
