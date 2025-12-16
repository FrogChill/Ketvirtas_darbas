import { createContext, useEffect, useState } from "react";
import { ref, set, get, update, remove, push, onValue } from "firebase/database";
import { database } from "../services/firebase";

export const ProductContext = createContext();

export const ProductProvider = ({ children, user }) => {
  const [products, setProducts] = useState([]);
  const [outgoingProducts, setOutgoingProducts] = useState([]);

  useEffect(() => {
    onValue(ref(database, "products"), snap => {
      const data = snap.val() || {};
      setProducts(Object.keys(data).map(k => ({ id: k, ...data[k] })));
    });

    onValue(ref(database, "outgoing_products"), snap => {
      const data = snap.val() || {};
      setOutgoingProducts(Object.keys(data).map(k => ({ id: k, ...data[k] })));
    });
  }, []);

  const addProduct = async (code, name, description) => {
    const productRef = ref(database, `products/${code}`);
    const snap = await get(productRef);

    if (snap.exists()) {
      await update(productRef, { quantity: snap.val().quantity + 1 });
    } else {
      await set(productRef, {
        name,
        description,
        quantity: 1,
        createdAt: new Date().toISOString(),
        addedBy: user.email
      });
    }
  };

  const removeProduct = async (code) => {
    const refP = ref(database, `products/${code}`);
    const snap = await get(refP);

    if (!snap.exists()) return;

    snap.val().quantity > 1
      ? update(refP, { quantity: snap.val().quantity - 1 })
      : remove(refP);
  };

  const moveToOutgoing = async (code) => {
    const refP = ref(database, `products/${code}`);
    const snap = await get(refP);

    if (!snap.exists()) return;

    await push(ref(database, "outgoing_products"), {
      code,
      name: snap.val().name,
      outDate: new Date().toISOString(),
      handledBy: user.email
    });

    await removeProduct(code);
  };

  return (
    <ProductContext.Provider value={{
      products,
      outgoingProducts,
      addProduct,
      removeProduct,
      moveToOutgoing
    }}>
      {children}
    </ProductContext.Provider>
  );
};
