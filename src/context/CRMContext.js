import React, { createContext, useState } from 'react';

const CRMContext = createContext([ {}, () => {}]);

const CRMProvider = props => {

    //state inicial
    const [ auth, guardarAuth ] = useState({
        toke: '',
        auth: false,
    });

    return (
        <CRMContext.Provider value={[auth, guardarAuth]}>
            {props.children}
        </CRMContext.Provider>
    )
}

export { CRMContext, CRMProvider };
