const CART_STORAGE_KEY = "customer-cart";

const isBrowser = typeof window !== "undefined";

const dispatchCartEvent = () => {
    if (isBrowser) {
        window.dispatchEvent(new Event("cart-updated"));
    }
};

export const getCartItems = () => {
    if (!isBrowser) return [];

    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        return [];
    }
};

export const saveCartItems = (cartItems) => {
    if (!isBrowser) return;

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    dispatchCartEvent();
};

export const clearCart = () => {
    if (!isBrowser) return;

    localStorage.removeItem(CART_STORAGE_KEY);
    dispatchCartEvent();
};

export const getCartCount = () => {
    const cartItems = getCartItems();
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
};

export const getCartTotal = () => {
    const cartItems = getCartItems();
    return cartItems.reduce((sum, item) => {
        const price = Number(item.sellingPrice || item.mrp || 0);
        const quantity = Number(item.quantity || 1);
        return sum + price * quantity;
    }, 0);
};

export const addToCart = (service) => {
    if (!isBrowser || !service) return [];

    const cartItems = getCartItems();
    const identifier = service._id || service.slug;
    const existingIndex = cartItems.findIndex(
        (item) => item._id === service._id || item.slug === service.slug,
    );

    if (existingIndex >= 0) {
        cartItems[existingIndex] = {
            ...cartItems[existingIndex],
            quantity: (Number(cartItems[existingIndex].quantity) || 1) + 1,
        };
    } else {
        cartItems.push({
            ...service,
            quantity: 1,
        });
    }

    saveCartItems(cartItems);
    return cartItems;
};

export const removeFromCart = (serviceIdOrSlug) => {
    if (!isBrowser) return [];

    const cartItems = getCartItems();
    const updated = cartItems.filter(
        (item) => item._id !== serviceIdOrSlug && item.slug !== serviceIdOrSlug,
    );

    saveCartItems(updated);
    return updated;
};

export const updateCartItemQuantity = (serviceIdOrSlug, quantity) => {
    if (!isBrowser) return [];

    const cartItems = getCartItems();
    const updated = cartItems.map((item) => {
        if (item._id === serviceIdOrSlug || item.slug === serviceIdOrSlug) {
            return {
                ...item,
                quantity: Math.max(1, Number(quantity) || 1),
            };
        }
        return item;
    });

    saveCartItems(updated);
    return updated;
};
