/**
 * @typedef Event
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} date
 * @property {string} location
 */

// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2601-FTB-CT-WEB-PT";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

//=== State ===
let parties = [];
let selectedEvent;

async function getParties() {
  const eventResponse = await fetch(API);
  const eventJSON = await eventResponse.json();
  const eventResults = eventJSON.data;

  for (let i = 0; i < eventResults.length; i++) {
    parties[i] = eventResults[i];
  }

  console.log(eventResults);
}

async function getEvent(id) {
  for (let i = 0; i < parties.length; i++) {
    if (parties[i].id === id) {
      selectedEvent = parties[i];
    }
  }
  render();
}

// === Components ===

// }
function EventListItem(event) {
  const $child = document.createElement("li");
  const $a = document.createElement("a");

  $a.href = "#selected";
  $a.textContent = event.name;
  $child.appendChild($a);

  $child.addEventListener("click", () => {
    getEvent(event.id);
  });

  return $child;
}

function EventList() {
  const $parent = document.createElement("ul");
  for (let i = 0; i < parties.length; i++) {
    $parent.appendChild(EventListItem(parties[i]));
  }
  return $parent;
}

function EventDetails() {
  if (!selectedEvent) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  } else {
    const $container = document.createElement("section");
    $container.className = "party";

    const $headerThree = document.createElement("h3");
    $headerThree.textContent =
      selectedEvent.name + " " + "#" + selectedEvent.id;

    const $headerFour = document.createElement("h4");
    const eventDate = new Date(selectedEvent.date);
    $headerFour.textContent = eventDate.toLocaleString("en-US", {
      dateStyle: "long",
    });

    const $secondHeaderFour = document.createElement("h4");
    $secondHeaderFour.textContent = selectedEvent.location;

    const $p = document.createElement("p");
    $p.textContent = selectedEvent.description;

    $container.appendChild($headerThree);
    $container.appendChild($headerFour);
    $container.appendChild($secondHeaderFour);
    $container.appendChild($p);

    return $container;
  }
}

// === Render ===
const render = async () => {
  console.log("Rendering...");

  try {
    const $app = document.querySelector("#app");
    $app.innerHTML = `
            <h1>Party Planner</h1>
            <main>
            <section>
                <h2>Upcoming Parties</h2>
                <EventList></EventList>
            </section>
            <section id="selected">
                <h2>Party Details</h2>
                <EventDetails></EventDetails>
            </section>
            </main>
        `;
    $app.querySelector("EventList").replaceWith(EventList());
    $app.querySelector("EventDetails").replaceWith(EventDetails());
  } catch (e) {
    console.error(e);
    append.textContent = `Failed to fetch from API. Please refresh at a later time.`;
  }
};

async function init() {
  await getParties();
  render();
}

init();
