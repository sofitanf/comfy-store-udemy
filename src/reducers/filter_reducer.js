import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.map((p) => p.price);
      maxPrice = Math.max(...maxPrice);
      return {
        ...state,
        all_products: [...action.payload],
        filtered_products: [...action.payload],
        filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
      };
    case SET_GRIDVIEW:
      return { ...state, grid_view: true };
    case SET_LISTVIEW:
      return { ...state, grid_view: false };
    case UPDATE_SORT:
      return { ...state, sort: action.payload };
    case SORT_PRODUCTS:
      const { sort, filtered_products } = state;
      let tempProduct = [...filtered_products]; //copy values from filtered_products
      if (sort === "price-lowest") {
        tempProduct = tempProduct.sort((a, b) => a.price - b.price);
      }
      if (sort === "price-highest") {
        tempProduct = tempProduct.sort((a, b) => b.price - a.price);
      }
      if (sort === "name-a") {
        tempProduct = tempProduct.sort((a, b) => a.name.localeCompare(b.name));
      }
      if (sort === "name-z") {
        tempProduct = tempProduct.sort((a, b) => b.name.localeCompare(a.name));
      }
      return { ...state, filtered_products: tempProduct };
    case UPDATE_FILTERS:
      const { name, value } = action.payload;
      return { ...state, filters: { ...state.filters, [name]: value } };
    case FILTER_PRODUCTS:
      const { all_products } = state;
      const { text, category, company, color, price, shipping } = state.filters;

      // before filtering, u must copy all products (default data)
      let tempProducts = [...all_products];

      // filtering
      // text
      if (text) {
        tempProducts = tempProducts.filter((product) =>
          product.name.toLowerCase().includes(text)
        );
      }
      // category
      if (category !== "all") {
        tempProducts = tempProducts.filter(
          (product) => product.category === category
        );
      }

      // company
      if (company !== "all") {
        tempProducts = tempProducts.filter(
          (product) => product.company === company
        );
      }

      // colors. in array
      if (color !== "all") {
        tempProducts = tempProducts.filter((product) => {
          return product.colors.find((c) => c === color);
        });
      }

      // shipping
      if (shipping) {
        tempProducts = tempProducts.filter(
          (product) => product.shipping === true
        );
      }

      // price
      tempProducts = tempProducts.filter((product) => product.price <= price);

      // if filtering remove, back to tempProducts (default data)
      return { ...state, filtered_products: tempProducts };
    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          text: "",
          company: "all",
          category: "all",
          color: "all",
          price: state.filters.max_price,
          shipping: false,
        },
      };
    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default filter_reducer;
