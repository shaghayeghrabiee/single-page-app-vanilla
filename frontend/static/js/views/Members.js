import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.slug = params.slug;
  }

  async getMembers() {
    try {
      const response = await axios.get(
        `https://api.gameofthronesquotes.xyz/v1/house/${this.slug}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return "";
    }
  }
  async getHtml() {
    try {
      const data = await this.getMembers();
      let result = "";
      console.log(data[0].members);
      const members = data[0].members;
      members.map((member) => {
        result += `<li class="member">${member.name}</li>`;
      });
      return ` 
          <div class="membersImg"></div> 
          <div class="memberContainer">
            <h2>House of ${this.slug}.</h2>
            <h4>Members:</h4>
            <ul>${result}</ul>
          </div>
          
     `;
    } catch (error) {
      console.log(error);
      return "";
    }
  }
}
