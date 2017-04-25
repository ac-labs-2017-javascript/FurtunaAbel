import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

var state = {counter : 0};


// var history = [];
//
// function pushHistory(history) {
//   history.push(history);
// }
// function popHistory(history) {
//   if (true) {
//
//   }
// }

function appLogic(state, action){
  if (action.type === "INC") {
    return {
      counter:state.counter + 1
    };

  }else if(action.type === "DEC"){
    return {
      counter:state.counter - 1
    };
  }
  return state;
}

function handler(action) {
    state = appLogic(state, action);
    ReactDOM.render(
      <App state={state} />,
      document.getElementById('root')
    );


}

 function Hello({name , counter}){

   return(
     <div>
        <div>Hello {name} {counter + ""}</div>
         <button onClick={()=>handler({type:"INC"})}>Click Me! INC</button>
         <button onClick={()=>handler({type:"DEC"})}>Click Me! DEC</button>
     </div>


   );
}


 function App({state})  {
    return (
      <div className="App">
        <Hello name="bade"
          counter={state.counter}/>
      </div>
    );

}
handler({type:"init"});
export default App;
