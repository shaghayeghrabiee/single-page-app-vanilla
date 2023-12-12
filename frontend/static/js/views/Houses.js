import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Houses");
  }

  async fetchData() {
    try {
      const response = await axios.get(
        "https://api.gameofthronesquotes.xyz/v1/houses"
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getHouse(house) {
    try {
      const response = await axios.get(
        `https://api.gameofthronesquotes.xyz/v1/house/${house}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async renderHouses(houses) {
    let result = "";
    houses.map((house) => {
      result += `
        <div class="card">
          <div class="text-center">
            <h5>${house.name.split(" ").slice(1).join(" ")}</h5>
            <a href="/members/${house.slug}" target="_blank" data-id=${
        house.slug
      } class="card-button">Details</a>
          </div>
        </div>
      `;
    });
    const houseContainer = document.querySelector(".houseContainer");
    houseContainer.innerHTML = result;
  }

  async getHtml() {
    try {
      const fetchedHouses = await this.fetchData();
      let result = "";
      fetchedHouses.forEach((house) => {
        result += `
          <div class="card">
            <div class="text-center">
              <h5>${house.name.split(" ").slice(1).join(" ")}</h5>
              <a href="/members/${house.slug}" target="_blank" data-id=${
          house.slug
        } class="card-button">Details</a>
            </div>
          </div>
        `;
      });

      const htmlContent = `<div class="containerHouse">
                              <div class="searchHouse">
                                <input  type="text" id="searchHouse" placeholder="Search for a house..."/>
                                <button id="searchBtn">Search</button>
                                <button id="clearBtn">clear</button>
                              </div>
                              <div class="handleSmallScreen"><div class="houseContainer">${result}</div></div>
                          </div>`;

      return htmlContent;
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  async executeViewScript() {
  try {
    const input = document.querySelector("#searchHouse");
    const searchBtn = document.querySelector("#searchBtn");
    const clearBtn = document.querySelector("#clearBtn");

    searchBtn.addEventListener("click", async () => {
      try {
        const result = await this.getHouse(input.value.toLowerCase());
        const searchResultContainer = document.querySelector(".houseContainer");
        searchResultContainer.innerHTML = "";
        this.renderHouses(result); 
      } catch (error) {
        console.error(error);
      }
    });

    clearBtn.addEventListener("click", async () => {
      try {
        input.value = "";
        const result = await this.fetchData();
        const searchResultContainer = document.querySelector(".houseContainer");
        searchResultContainer.innerHTML = "";
        this.renderHouses(result);
      } catch (error) {
        console.error(error);
      }
    });

    const fetchedHouses = await this.fetchData();
    this.renderHouses(fetchedHouses);
  } catch (error) {
    console.error(error);
  }
}
}
