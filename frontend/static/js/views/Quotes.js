import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Quotes");
  }

  async getQuotes() {
    try {
      const quotes = await axios
        .get(`https://api.gameofthronesquotes.xyz/v1/random/5`)
        .then((res) => res.data);
      return quotes;
    } catch (error) {
      console.log(error);
    }
  }

  async getHtml() {
    let result = "";
    const quotes = await this.getQuotes();
    quotes.map((quote) => {
      result += `<div class="quote" id="quote">
                    <p>" ${quote.sentence} "</p>
                    <h4>${quote.character.name}</h4>
                   
            </div>`;
    });

    return `
    <div class="quoteContainer">   
    <button id="quoteBTN">Replace quotes</button>    
        <div >${result}</div>
        
    </div>
        `;
  }
  // async onViewReady() {
  //   const randomQuoteBTN = document.querySelector("#quoteBTN");
  //   randomQuoteBTN.addEventListener("click", async () => {
  //     const quotes = await this.getQuotes();
  //     const quotesContainer = document.querySelector(".quoteContainer>div");

  //     let html = "";
  //     quotes.forEach((quote) => {
  //       html += `
  //         <div class="quote" id="quote">
  //           <h3>${quote.character.name}</h3>
  //           <p>${quote.sentence}</p>
  //         </div>
  //         `;
  //     });

  //     quotesContainer.innerHTML = html;
  //   });
  // }
  async randomQuote() {
    const quoteBtn = document.querySelector("#quoteBTN");
    quoteBtn.addEventListener("click", async () => {
      const quotes = await this.getQuotes();
      const quotesContainer = document.querySelector(".quoteContainer >div");
      let result = "";
      quotes.map((quote) => {
        result += `<div class="quote" id="quote">
                    <p>" ${quote.sentence} "</p>
                    <h4>${quote.character.name}</h4>
                   
                   
            </div>`;
      });
      quotesContainer.innerHTML = result;
    });
  }
}
