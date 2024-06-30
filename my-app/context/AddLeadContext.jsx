import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AddLeadContext = createContext();

export const AddLeadProvider = ({ children }) => {
  const [addLead, setAddLead] = useState(false);

  const toggleAddLead = () => {
    setAddLead((addLead) => !addLead);
  };

  return (
    <AddLeadContext.Provider
      value={{
        addLead,
        toggleAddLead,
      }}
    >
      {children}
    </AddLeadContext.Provider>
  );
};

AddLeadProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
