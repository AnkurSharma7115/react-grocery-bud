import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let listItems = localStorage.getItem('list')
  if(listItems){
    return JSON.parse(localStorage.getItem('list'))
  }
  else{
    return []
  }
}

function App() {
  const [name, setName] = useState('')  
  const [list, setList] = useState(getLocalStorage)
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({ show: false, msg: '', type: ''})

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!name){ //check for empty values
      showAlert(true, 'danger', 'Please enter Value')
    }else if(name && isEditing){ // deal with edit
      setList(list.map((item)=>{
        if(item.id===editID){
          return {...item, title:name}
        }
        return item
      }))
      setName('')
      setEditID(null)
      setIsEditing(false)
      showAlert(true, 'success', 'Item Edited')
    }else{ // show alert for successfully item inserted
      showAlert(true, 'success', 'Item added to List')
        const newItem = { id: new Date().getTime().toString(), title:name}
        setList([...list, newItem])
        setName('')
    }
  }
  
  const showAlert=(show=false, type="", msg="") => {
    setAlert({show:show, type, msg})
  }
  const clearList =() => {
    showAlert(true, 'danger', 'Your list is empty now')
    setList([])
  }
  const removeItem=(id)=>{
    showAlert(true, 'danger', 'Item Removed')
    setList(list.filter((item)=> item.id !== id))
  }
  const editItem = (id) =>{
    const receivedItem = list.find((item)=> item.id ===id)
    setIsEditing(true)
    setEditID(id)
    setName(receivedItem.title)
  }

  useEffect(() => {
   localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <section className="section-center">
      <form className= 'grocery-form' onSubmit= {handleSubmit}>
        
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}

        <h3>Grocery Bud</h3>
        <div className="form-control">
          <input type="text" className='grocery' placeholder='e.g., eggs'
                  value={name} onChange ={(e)=> setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing? 'Edit' : 'Submit'}
          </button>
        </div>
      </form>
      <div className="grocery-container">
        
        <List items={list} removeItem={removeItem} editItem={editItem}/>
        
        <button className='clear-btn' onClick={clearList}> Clear Items</button>
      </div>
    </section>
  )

}

export default App
