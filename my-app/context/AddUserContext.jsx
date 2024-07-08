import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AddUserContext = createContext();

export const AddUserProvider = ({ children }) => {
  const [addUser, setAddUser] = useState(false);

  const toggleAddUser = () => {
    setAddUser((addUser) => !addUser);
  };

  return (
    <AddUserContext.Provider
      value={{
        addUser,
        toggleAddUser,
      }}
    >
      {children}
    </AddUserContext.Provider>
  );
};

AddUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
