const initialState = {
    dropdown: {
        isOpen: false,
    },
    blogDropdown: {
        isOpen: false,
    }
};

export const DropdownReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'toggle':
      return {
        ...state,
        dropdown: {
            ...state.dropdown,
            isOpen: !state.dropdown.isOpen,
          },
      };
    case 'blogToggle':
      return {
        ...state,
        blogDropdown: {
            ...state.blogDropdown,
            isOpen: !state.blogDropdown.isOpen,
          },
      };
    default:
      return state;
  }
};
