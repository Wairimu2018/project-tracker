import React from 'react';

const PanelHeader = ({title, handleAdd, handleClose}) => {
  return (
    <div className='header'>
      { title &&
      <p><i className='fa fa-times' onClick={handleClose}/>{title}</p> }
      { handleAdd &&
        <i className='fa fa-plus' onClick={handleAdd}/> }
    </div>
  )
}

export default PanelHeader
