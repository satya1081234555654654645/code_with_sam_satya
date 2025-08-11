document.addEventListener("DOMContentLoaded", () => {
  const currentUser = sessionStorage.getItem("loggedInUser");
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  document.querySelector(".app-header h1").textContent = `${currentUser}'s Phonebook`;

  const contactForm = document.getElementById("add-contact-form");
  const contactName = document.getElementById("contact-name");
  const contactPhone = document.getElementById("contact-phone");
  const editingIndex = document.getElementById("editing-index");
  const contactList = document.getElementById("contact-list");

  const getContactsKey = () => `contacts_${currentUser}`;

  const loadContacts = () => {
    const contacts = JSON.parse(localStorage.getItem(getContactsKey())) || [];
    contactList.innerHTML = "";

    if (contacts.length === 0) {
      contactList.innerHTML = "<p style='text-align:center;'>No contacts yet.</p>";
      return;
    }

    contacts.forEach((contact, index) => {
      const div = document.createElement("div");
      div.className = "contact-item";
      div.innerHTML = `
        <div>
          <p class="contact-name">${contact.name}</p>
          <p class="contact-phone">${contact.phone}</p>
        </div>
        <div>
          <button class="btn btn-danger" data-index="${index}" data-action="delete">Delete</button>
          <button class="btn btn-secondary" data-index="${index}" data-action="edit">Update</button>
        </div>
      `;
      contactList.appendChild(div);
    });
  };

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = contactName.value.trim();
    const phone = contactPhone.value.trim();
    let contacts = JSON.parse(localStorage.getItem(getContactsKey())) || [];

    if (editingIndex.value !== "") {
      // Update contact
      contacts[editingIndex.value] = { name, phone };
      editingIndex.value = "";
    } else {
      // Add new contact
      contacts.push({ name, phone });
    }

    localStorage.setItem(getContactsKey(), JSON.stringify(contacts));
    contactForm.reset();
    loadContacts();
  });

  contactList.addEventListener("click", (e) => {
    const index = e.target.getAttribute("data-index");
    const action = e.target.getAttribute("data-action");

    if (!index) return;

    let contacts = JSON.parse(localStorage.getItem(getContactsKey())) || [];

    if (action === "delete") {
      contacts.splice(index, 1);
    } else if (action === "edit") {
      contactName.value = contacts[index].name;
      contactPhone.value = contacts[index].phone;
      editingIndex.value = index;
    }

    localStorage.setItem(getContactsKey(), JSON.stringify(contacts));
    loadContacts();
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });

  loadContacts();
});
