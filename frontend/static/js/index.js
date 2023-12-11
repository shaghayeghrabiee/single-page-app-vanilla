import Houses from "./views/Houses.js";
import Quotes from "./views/Quotes.js";
import Person from "./views/Person.js";
import Members from "./views/Members.js";

const pathToRegex = (path) =>
  new RegExp(
    "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([\\w-]+)") + "$"
  );
const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: "/", view: Houses },
    { path: "/quotes", view: Quotes },
    { path: "/members/:slug", view: Members },
    { path: "/Person", view: Person },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  const view = new match.route.view(getParams(match));

  document.querySelector("#app").innerHTML = await view.getHtml();
  await view.executeViewScript();
  if (view.randomQuote) {
    await view.randomQuote();
  }

};
/*Showing house members in subpage*/ 
document.body.addEventListener("click", async (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const url = new URL(e.target.href);
    if (url.pathname === "/members") {
      const slug = url.searchParams.get("data-id");
      navigateTo(`/members/${slug}`);
    } else {
      navigateTo(e.target.href);
    }
  }
});
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});
/************************************* */

