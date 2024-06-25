<template>
  <div class="container">
    <h1 class="title is-4 has-text-centered">Site Setup</h1>
    <div class="columns">
      <div class="column is-2">
        <h3>Site Image</h3>
        <figure class="image is-128x128 ml-auto mr-auto">
          <img :src="siteSetup.get_site_image" alt="placeholder-image" />
        </figure>
        <hr />
        <div class="field">
          <label class="label">Login Image</label>
          <div class="control">
            <input class="input" type="file" @change="handleFileUpload" />
          </div>
        </div>
      </div>
      <div class="column is-10">
        <div>
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input class="input" type="text" v-model="siteSetup.title" />
            </div>
          </div>

          <div class="field">
            <label class="label">Card 1 Name</label>
            <div class="control">
              <input class="input" type="text" v-model="siteSetup.card1_name" />
            </div>
          </div>

          <div class="field">
            <label class="label">Card 1 Content</label>
            <div class="control">
              <textarea class="textarea" v-model="siteSetup.card1"></textarea>
            </div>
          </div>

          <div class="field">
            <label class="label">Card 2 Name</label>
            <div class="control">
              <input class="input" type="text" v-model="siteSetup.card2_name" />
            </div>
          </div>

          <div class="field">
            <label class="label">Card 2 Content</label>
            <div class="control">
              <textarea class="textarea" v-model="siteSetup.card2"></textarea>
            </div>
          </div>

          <div class="field">
            <label class="label">Card 3 Name</label>
            <div class="control">
              <input class="input" type="text" v-model="siteSetup.card3_name" />
            </div>
          </div>

          <div class="field">
            <label class="label">Card 3 Content</label>
            <div class="control">
              <textarea class="textarea" v-model="siteSetup.card3"></textarea>
            </div>
          </div>

          <div class="field">
            <label class="label">Hero Name</label>
            <div class="control">
              <input class="input" type="text" v-model="siteSetup.hero_name" />
            </div>
          </div>

          <div class="field">
            <label class="label">Hero Message</label>
            <div class="control">
              <textarea class="textarea" v-model="siteSetup.hero_message"></textarea>
            </div>
          </div>

          <div class="columns">
            <div class="column is-4">
              <h3>Address</h3>
              <div class="field">
                <label class="label">Site Email</label>
                <div class="control">
                  <input
                    type="email"
                    class="input"
                    v-model="siteSetup.addresses.email_contact"
                  />
                </div>
              </div>
              <div class="field">
                <label class="label">Phone Contact</label>
                <div class="control">
                  <input
                    type="text"
                    class="input"
                    v-model="siteSetup.addresses.phone_contact"
                  />
                </div>
              </div>
              <div class="field">
                <label class="label">location_address</label>
                <div class="control">
                  <textarea
                    class="textarea"
                    v-model="siteSetup.addresses.location_address"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="column is-8">
              <h3>About</h3>
              <div class="field">
                <label class="label">About page</label>
                <div class="control">
                  <textarea
                    class="textarea"
                    v-model="siteSetup.abouts.about_message"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-primary" @click="submitForm()">
                Save Site info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      siteSetup: {
        title: "",
        card1_name: "",
        card1: "",
        card2_name: "",
        card2: "",
        card3_name: "",
        card3: "",
        hero_name: "",
        hero_message: "",
        login_image: null,
        addresses: {
          email_contact: "",
          phone_contact: "",
          location_address: "",
        },
        abouts: {
          about_message: "",
        },
      },
    };
  },
  created() {
    this.fetchSiteSetup();
  },
  methods: {
    async fetchSiteSetup() {
      try {
        const response = await axios.get("authentication/site-setup/");
        this.siteSetup = response.data;
        // this.siteSetup.login_image = response.data.get_site_image;
      } catch (error) {
        console.error("Error fetching site setup:", error);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.siteSetup.login_image = file;
    },
    async submitForm() {
      try {
        const formData = new FormData();
        for (const key in this.siteSetup) {
          if (key === "login_image") {
            if (this.siteSetup.login_image instanceof File) {
              formData.append(key, this.siteSetup.login_image);
            }
          } else if (
            typeof this.siteSetup[key] === "object" &&
            this.siteSetup[key] !== null
          ) {
            for (const subKey in this.siteSetup[key]) {
              formData.append(`${key}[${subKey}]`, this.siteSetup[key][subKey]);
            }
          } else {
            formData.append(key, this.siteSetup[key]);
          }
        }

        // Log the FormData for debugging
        for (const pair of formData.entries()) {
          console.log(`${pair[0]}, ${pair[1]}`);
        }

        const response = await axios.put("authentication/site-setup/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error("Error updating site setup:", error);
      }
    },
  },
};
</script>
<style scoped>
.image {
  margin-bottom: 20px;
}

.field {
  margin-bottom: 15px;
}
</style>
