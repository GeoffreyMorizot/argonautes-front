import "./assets/styles/main.scss";
import { apiFetch, formDataToJson } from "./assets/js/utils";

class Argonautes {
  constructor() {
    this.argonautes = [];
    this.error = null;
    this.BASE_URL = import.meta.env.DEV ? "http://localhost:5050/api/argonautes/" : "https://argonautes-api.herokuapp.com/api/argonautes/";
    this.form = document.getElementById("form");
    this.memberList = document.getElementById("member-list");
    this.handleSubmit = this.handleSubmit.bind(this);
    form.addEventListener("submit", this.handleSubmit);
    this.init();
  }

  async init() {
    this.argonautes = await apiFetch(this.BASE_URL, {
      method: "GET",
    });
    this.render(this.argonautes);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.add(this.BASE_URL, new FormData(e.currentTarget));
    e.currentTarget.reset();
  }

  async add(url, formData) {
    await apiFetch(url, {
      method: "POST",
      body: formDataToJson(formData),
    }).then((newArg) => (this.argonautes = [...this.argonautes, newArg]));

    this.render(this.argonautes);
  }

  async delete(url) {
    const removedArgonaute = await apiFetch(url, {
      method: "DELETE",
    });

    this.argonautes = this.argonautes.filter((arg) => arg._id !== removedArgonaute._id);
    this.render(this.argonautes);
  }

  update(url, value) {
    apiFetch(url, {
      method: "PUT",
      body: JSON.stringify({ name: value }),
    }).then((updatedArg) => {
      const index = this.argonautes.findIndex((arg) => arg._id === updatedArg._id);
      this.argonautes[index] = updatedArg;
      this.render(this.argonautes);
    });
  }

  deleteListener(btnArray = [...document.querySelectorAll(".item__button")]) {
    btnArray.forEach((btn) => {
      btn.addEventListener("click", ({ target }) => {
        this.delete(`${this.BASE_URL}${target.dataset.id}`, target.dataset.id);
      });
    });
  }

  setListener(btnArray = [...document.querySelectorAll(".item__button")]) {
    btnArray.forEach((btn) => {
      btn.addEventListener("click", ({ target }) => {
        if (target.dataset.action === "delete") {
          this.delete(`${this.BASE_URL}${target.dataset.id}`, target.dataset.id);
        } else if (target.dataset.action === "update") {
          const updatedValue = target.parentNode.getElementsByTagName("input").name.value;
          this.update(`${this.BASE_URL}${target.dataset.id}`, updatedValue);
        }
      });
    });
  }

  render(data) {
    this.memberList.innerHTML = "";
    if (this.argonautes <= 0) {
      this.memberList.innerHTML = "<li class='row__item--empty'>Aucun Argonautes</li>";
    }
    data.forEach((d) => {
      const li = `<li class="row__item">
                  <input name="name" value=${d.name}>
                  <button class="item__button btn--secondary" title="Editer" data-action="update"  data-id=${d._id}>Editer</button>
                  <button class="item__button btn--secondary" title="Effacer" data-action="delete"  data-id=${d._id}>Effacer</button>
               </li>`;
      this.memberList.innerHTML += li;
    });
    this.setListener();
  }
}

const arg = new Argonautes();
window.argonaute = arg;
