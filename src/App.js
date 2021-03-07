import { useEffect, useReducer } from 'react';
import './App.css';
import React from 'react'
import { Button, FormControl, FormHelperText, Input, InputLabel } from '@material-ui/core';
import db from './firebase'
import firebase from 'firebase'


const ACTIONS = {
  CHANGE: 'change',
  ADD_TODO: 'add-todo',
  ADD_DB_TODO: 'add-db-todo'
}

const reducer = (state, action) => {
  switch(action.type) {
    case ACTIONS.CHANGE:  
      return { ...state, value : action.payload.value }
    case ACTIONS.ADD_TODO:
      action.payload.event.preventDefault()
      let theTodo = newTodo(action.payload.name)
      db.collection('todos').add({
        todo: theTodo.name,
        id: theTodo.id,
        completed: theTodo.complete
      })
      return { ...state, todo: [...state.todo, theTodo]}
    case ACTIONS.ADD_DB_TODO:
      const newList = action.list.map(todo => newTodo(todo))
      return { ...state, todo: [ ...newList]}
    default:
      return state
  }
}


const newTodo = name => {
  return { id: firebase.firestore.FieldValue.serverTimestamp(), name: name, complete: false }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { todo: [] , value:'' })

  const eventHandler = (event, type) => {
    dispatch({type: type, payload: { value: event.target.value, event: event, name: state.value}})
  }

  useEffect(() => {
    db.collection('todos').orderBy('id', 'desc').onSnapshot(snapshot => {
      dispatch({type: ACTIONS.ADD_DB_TODO, list: snapshot.docs.map(doc => doc.data().todo)})
    })
  }, [])

  return (
    <div className="App">
      <div>
            <h1>Hey, welcome to the todo app 🚀 </h1>
            <FormControl>
                {}
                <InputLabel>✅ Add Todo</InputLabel>
                <Input type='text' value={state.value} onChange={event => eventHandler(event, ACTIONS.CHANGE)}/>
                <FormHelperText>Limits are only in the mind ♾️</FormHelperText>
            </FormControl>
            <Button variant="outlined" color="primary" onClick={event => eventHandler(event, ACTIONS.ADD_TODO)}>
            Add Todo
            </Button>
            <br />
        </div>
    <ul>
      {state.todo.map(todo => (<li>{todo.name}</li>))}
    </ul>
    </div>
  );
}

export default App;
