import React from 'react'

function Cards({card, startDragging, showingCardMenu, cardMenu, deleteCard, lane, openModal}) {
    return (
        <li className='card'draggable="true" onDragStart={(e)=>startDragging(e,card)}>
            <div className="flexRow justifyCntBtwn w100">
                <p className={`cardType ${card.cardType}`}><i className="fas fa-circle"></i> {card.cardType}</p>
                <div>
                    <button className='deleteCardBtn' onClick={()=>showingCardMenu(card.id)}><i className="far fa-edit"></i></button>
                </div>
            </div>
            <div className="flexRow justifyCntStrt w100">
            {  
            card.colors?
            card.colors.map((color, idx)=>
                            <p key={`color${idx}`} className={`colorBoxSmal ${color}`}></p>
                        )
                : null
            }

            </div>
            <h4>{card.cardTittle}</h4>
            {
                cardMenu.show ===true && cardMenu.cardId===card.id ?
                <ul className="cardMenu">
                    <li>
                        <button onClick={()=>showingCardMenu(card.id)} className='flexRow justifyCntEnd w100'><i className="fas fa-times"></i></button>
                    </li>
                    <li>
                        <button onClick={()=>deleteCard(lane.laneId, card.id)}><i className="fas fa-trash"></i>  &nbsp; &nbsp;Delete</button>
                    </li>
                    <li>
                        <button onClick={()=>openModal('editCard', lane.laneId, card.id)}> <i className="fas fa-pencil-alt"></i> &nbsp; &nbsp; Edit</button>
                    </li>
                </ul>
            :null
            }
        </li>
    )
}

export default Cards
