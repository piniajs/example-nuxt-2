<template>
  <main class="prose mx-auto">
    <h1>Hello 🍍 Pinia!</h1>

    <p><nuxt-link to="/">Back Home</nuxt-link></p>

    <h2>Hello {{ user.name }}</h2>

    <pre>{{ user.$state }}</pre>

    <form @submit.prevent="addItemToCart">
      <input type="text" class="text-black px-2" v-model="itemName" />
      <br />
      <button class="btn m-3 text-sm mt-8" :disabled="!itemName">
        Add Item
      </button>
    </form>

    <form @submit.prevent="buy">
      <ul>
        <li v-for="item in cart.items" :key="item.name">
          {{ item.name }} ({{ item.amount }})
          <button
            class="btn m-3 text-sm mt-8"
            @click="cart.removeItem(item.name)"
            type="button"
          >
            X
          </button>
        </li>
      </ul>

      <button class="btn m-3 text-sm mt-8" :disabled="!user.name">Buy</button>
      <button class="btn m-3 text-sm mt-8" @click="clearCart" type="button">
        Clear the cart
      </button>
    </form>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { useUserStore } from '~/store'
import { useCartStore } from '~/store'

export default defineComponent({
  fetch({ $pinia }) {
    const user = useUserStore($pinia)
    console.log('user is', user.name)
  },
  setup() {
    const user = useUserStore()
    const cart = useCartStore()

    const itemName = ref('')

    function addItemToCart() {
      if (!itemName.value) return
      cart.addItem(itemName.value)
      itemName.value = ''
    }

    if (process.server) {
      cart.addItem('Gift from the server')
    }

    function clearCart() {
      if (window.confirm('Are you sure you want to clear the cart?')) {
        cart.$patch({ rawItems: [] })
      }
    }

    async function buy() {
      const n = await cart.purchaseItems()

      console.log(`Bought ${n} items`)

      cart.rawItems = []
    }

    return {
      itemName,
      addItemToCart,
      cart,

      user,
      buy,
      clearCart,
    }
  },
})
</script>
