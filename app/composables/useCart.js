import { ref, computed } from "vue";

const cartItems = ref(JSON.parse(localStorage.getItem("cart") || "[]"));
const isCartOpen = ref(false);

export function useCart() {
  const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cartItems.value));
  };

  const addToCart = (product, qty = 1) => {
    const config = useRuntimeConfig();
    const existing = cartItems.value.find((i) => i.id === product.id);

    if (existing) {
      existing.quantity += qty;
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.product_name,
        price: parseFloat(product.price), // This should be the final price after discount
        original_price: product.original_price
          ? parseFloat(product.original_price)
          : parseFloat(product.price),
        discount_type: product.discount_type || null,
        discount_amount: product.discount_amount || null,
        quantity: qty,
        image: product.images?.[0]
          ? product.images[0].startsWith("http://") ||
            product.images[0].startsWith("https://")
            ? product.images[0]
            : `${config.public.apiBase}/file/${product.images[0]}`
          : "",
      });
    }

    saveCart();
    isCartOpen.value = true;
  };

  const removeFromCart = (id) => {
    cartItems.value = cartItems.value.filter((i) => i.id !== id);
    saveCart();
  };

  const updateQuantity = (id, qty) => {
    const item = cartItems.value.find((i) => i.id === id);
    if (item) {
      item.quantity = Math.max(1, qty);
      saveCart();
    }
  };

  const clearCart = () => {
    cartItems.value = [];
    saveCart();
  };

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
  };

  const totalItems = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.quantity, 0)
  );

  const totalPrice = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  return {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    totalItems,
    totalPrice,
  };
}
