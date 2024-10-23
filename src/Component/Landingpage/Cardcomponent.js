import React from 'react';
import hotelimg from '../../images/hd2.jpg'
const Cardcomponent = (props) => {
  return (
    <div>
      <div className="card" style={{ width: '18rem' }}>

  <img src={hotelimg} className="card-img-top" alt="..."/>
  <div className="card-body">
    <h4 className="card-title">{props.title}</h4>
    <h5 className="card-title">{props.description}</h5>
    {/* <h5 className="card-title">{props.additionalData}</h5> */}
    <h5 className='"card-title'>{props.price}</h5>
    <p className="card-text">{props.additionalData}</p>
  </div>
  <ul className="list-group list-group-flush">
    <li className="list-group-item">An item</li>
    <li className="list-group-item">A second item</li>
    <li className="list-group-item">A third item</li>
  </ul>
  <div className="card-body">
    <a href="#" className="card-link" >Card link</a>
    <a href="#" className="card-link">Another link</a>
  </div>
</div>
    </div>
  )
}

export default Cardcomponent
