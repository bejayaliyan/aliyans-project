import React, { useState , createContext,useMemo, useEffect} from 'react';

export const StatusContext = createContext();


export const StatusContextProvider =(({children})=>{
    const [modalShow,setModalShow]=useState(false)
    const [error,setError]=useState(false)
    const contextValue= useMemo(()=>{
        return{
         modalShow: modalShow,
         setModalShow:setModalShow,
         error: error,
         setError:setError
        }
      },[modalShow,error]);
    return(
        <StatusContext.Provider value={contextValue}>
            {children}
        </StatusContext.Provider>
    )
})