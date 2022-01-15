import React, {useEffect, useState, useRef} from 'react'
import './Styles/general.css';
import { v4 as uuidv4 } from 'uuid';
import CardDetail from './CardDetail';
import Cards from './Cards';

function Dashboard() {
    const [showModal, setShowModal]=useState(false)
    const [showAddLaneForm, setShowAddLaneForm]=useState(false)
    const [showAddCardForm, setShowAddCardForm]=useState(false)
    const [showCardDetail, setShowCardDetail]=useState(false)
    const [editInput, setEditInput]=useState({show:false, laneId:''})
    const [cardMenu, setCardMenu]=useState({show:false, laneId:'', cardId:''})
    const [laneInput, setLaneInput]=useState({laneTittle: ''})
    const [cardInput, setCardInput]=useState({cardTittle: '', cardType: 'BUG', laneId: ''});
    const [alert, setAlert] = useState({show: false, alertText: ''})
    const [selectedCard, setSelectedCard] =  useState({})
    const [allLanes, setAllLanes]=useState([]);
    const [draggedCard, setDraggedCard]=useState({})
    const [laneTitle, setLaneTitle]=useState('')
    const inputLaneTittle = useRef();
    const inputCardTittle = useRef();
    
    const addLane=(e)=>{
        const laneId = uuidv4()
        e.preventDefault()
        // checking that user input is not empty
        if(laneInput.laneTittle===''){
            inputLaneTittle.current.focus();
            setAlert({show:true, alertText:'Please provide title of Lane'});
            return;
        }
        // creating an object to push in the local storage
        const laneObject ={
            laneId: laneId,
            laneTittle: laneInput.laneTittle,
            cards: []
        }
        // check if local storage already has lane property
        if(localStorage.lanes){
            const copyAllLanes=[...allLanes]
            //  then push new object to the new array
            copyAllLanes.push(laneObject)
            // update local storage
            localStorage.setItem("lanes",  JSON.stringify(copyAllLanes))
            setAlert({show: true, alertText: 'Lane successfully added'})
            setLaneInput({laneTittle: ''})
            setShowAddLaneForm(false)
            setTimeout(() => {
                setShowModal(!showModal)
                setAlert({show: false, alertText: ''})
                loadData()
            }, 800);
        }else{
            const laneArray = [laneObject]
            localStorage.setItem("lanes",  JSON.stringify(laneArray))
            setAlert({show: true, alertText: 'Lane successfully added'})
            setLaneInput({laneTittle: ''})
            setShowAddLaneForm(false)
            setTimeout(() => {
                setShowModal(!showModal)
                setAlert({show: false, alertText: ''})
                loadData()
            }, 800);
        }
    }
    const deleteLane =(laneId)=>{
        // copy all lanes
        const newCopy = [...allLanes]
        // filtering the array to remove the selected lane and saving it in a new array

        const filteredArray = newCopy.filter(lane=> {return lane.laneId!== laneId})
        
        localStorage.setItem("lanes",  JSON.stringify(filteredArray))

        loadData()
    }
    const addCard=(e)=>{
        const cardId = uuidv4()
        e.preventDefault()
        //  confirm if user input is not empty
        if(cardInput.cardTittle===''){
            inputCardTittle.current.focus();
            setAlert({show:true, alertText:'Please provide title of the Card'});
            return;
        }
        // adding the id to the card object
        const newCardObj={...cardInput, id: cardId}
        // add the card to the specific lane
        const newCopy = [...allLanes]
        newCopy.forEach(lane=>{
            // fine the lane 
            if(lane.laneId === newCardObj.laneId){
                // check if the lane has property of card
                if(lane.cards){
                    lane.cards.push(newCardObj)
                }
            }
        })
        localStorage.setItem("lanes",  JSON.stringify(newCopy))
        setAlert({show: true, alertText: 'Lane successfully added'})
        setCardInput({cardTittle: '', cardType: 'BUG', laneId: ''})
        setShowAddCardForm(false)
        setTimeout(() => {
            setShowModal(!showModal)
            setAlert({show: false, alertText: ''})
        }, 500);
    }
    const deleteCard=(laneId, cardId)=>{
        const newCopy =[...allLanes]
        newCopy.forEach(lane=>{
            if(lane.laneId ===laneId){
                // filter the cards of the lane with the cardId
                const filteredCardsArray=lane.cards.filter(card=>{
                    return card.id !== cardId
                })
                lane.cards=filteredCardsArray
            }
        })
        localStorage.setItem("lanes",  JSON.stringify(newCopy))
        loadData()
    }
    const handleInput=(e, type)=>{
        const {id, value} = e.target
        if(type=== "lane"){
            setLaneInput({[id]:value})
        }
        if(type=== "card"){
            setCardInput({...cardInput,[id]:value})
        }
    }
    const handleTypeInput=(e)=>{
        const {id, value} = e.target;
        setCardInput({...cardInput,[id]:value})
    }
    const openModal =(type, laneId, cardId)=>{
        setShowModal(!showModal)
        if(type === "addLane"){
            setShowAddLaneForm(true)
            setShowAddCardForm(false)
            setShowCardDetail(false)
        }
        if(type === "addCard"){
            setShowAddCardForm(true)
            setShowAddLaneForm(false)
            setShowCardDetail(false)
            setCardInput({...cardInput, laneId:laneId})
        }
        if(type === "editCard"){
            setShowCardDetail(true)
            setSelectedCard({laneId: laneId, cardId: cardId})
            setCardMenu({show:false, laneId:'', cardId:''})
        }
    }
    const closeModal =()=>{
        setShowModal(!showModal)
        setShowAddCardForm(false)
        setShowAddLaneForm(false)
        setShowCardDetail(false)
        setAlert({show: false, alertText: ''})
        setSelectedCard({})
    }
    const loadData = ()=>{
        // check if local storage has lanes object
        if(localStorage.lanes){
            setAllLanes(JSON.parse(localStorage.lanes))
        }
    }
    const allowDrop = (e)=>{
        e.preventDefault();
    }
    const dropCard = (e, lane)=>{
        e.preventDefault();
        if(draggedCard.laneId === lane.laneId){
            // if the cards are dropped in their original lane do nothing
            return
        }else{
            // copy the lanes
            const newLanes= [...allLanes]
            newLanes.forEach(eachLane=>{
                // finding out which lane was dropped on
                if(lane.laneId === eachLane.laneId){
                    // copying the card as a new card
                    const newCard = {...draggedCard}
                    newCard.laneId = lane.laneId
                    // push this card into the lane.
                    // first check if the card 
                    if(eachLane.cards){

                        eachLane.cards.push(newCard)
                    }else{
                        eachLane.cards = [newCard]
                    }
                }
                if(draggedCard.laneId===eachLane.laneId){
                    const filteredCardsArray = eachLane.cards.filter(card=>{
                        return card.id !== draggedCard.id
                    })
                    eachLane.cards = filteredCardsArray
                }
            })
            // deleting the card from the owning lane

            localStorage.setItem("lanes",  JSON.stringify(newLanes))
            loadData()
        }
    }
    const startDragging = (e, card)=>{
        // e.preventDefault();
        setDraggedCard(card)
    }
    const showingInputForm = (laneId)=>{
        setEditInput({show: true, laneId:laneId})
    }
    const showingCardMenu = (cardId)=>{
        if(!cardMenu.show){
            setCardMenu({show: true, cardId: cardId})
        }else{
            setCardMenu({show: false, cardId: ''})
        }
    }
    const handleLaneTitleInput=(e)=>{
        // updating lane title value in the lanes
        const{value, id} = e.target;
        const newArr=[...allLanes]
        newArr.forEach(lane=>{
            if(lane.laneId=== id){
                lane.laneTittle=value
            }
        })
        setAllLanes([...newArr])
        setLaneTitle(value)
    }
    const cancelEdit=()=>{
        setEditInput({show:false, laneId:''})
        loadData()
    }
    const saveLaneTiltleName=(e)=>{
        e.preventDefault()
        if(laneTitle.length>0){
            const newArr=[...allLanes]
            setEditInput({show:false, laneId:''})
            localStorage.setItem("lanes",  JSON.stringify(newArr))
            loadData()
        }else {

            loadData()
            setEditInput({show:false, laneId:''})
        }
    }
    useEffect(()=>{
        // loading all the data
        loadData()
    }, [])
    return (
        <section className='dashboard'>
            {
                showModal ?
            <div className="modalWindow">
                <div className="modal">
                    <div className="flexRow justifyCntEnd w100">
                        <button onClick={closeModal}><i className="fas fa-times"></i></button>
                    </div>
                    {
                        showAddLaneForm ?
                        <form onSubmit={(e)=>addLane( e, "lane")}>
                            <label htmlFor="laneTittle">Provide Lane Tittle</label>
                            <input type="text" id='laneTittle' 
                            value={laneInput.laneTittle} 
                            ref={inputLaneTittle}
                            onChange={(e)=>handleInput(e,"lane")}
                            placeholder='Enter Lane Tittle'
                            />
                            <button>Create Lane</button>
                        </form>
                        : null
                    }
                    {
                        showAddCardForm ?
                        <form onSubmit={(e)=>addCard( e, "card" )}>
                            <label htmlFor="cardTittle">Provide Card Tittle</label>
                            <input type="text" id='cardTittle' 
                            value={cardInput.cardTittle} 
                            onChange={(e)=>handleInput(e,"card")}
                            ref ={inputCardTittle}
                            placeholder='Enter Card Tittle'
                            />
                            <label htmlFor="cardType">select Type</label>
                            <select name="cardType" id="cardType" onChange={handleTypeInput}
                                defaultValue={cardInput.cardType} required>
                                <option hidden>BUG</option>
                                <option value="BUG">BUG</option>
                                <option value="FEATURE">FEATURE</option>
                                <option value="REQUEST">REQUEST</option>
                            </select>
                            <button>Create Card</button>
                        </form>
                        : null
                    }
                    {
                        showCardDetail ?
                        <CardDetail selectedCard={selectedCard} loadData={loadData} setAllLanes={setAllLanes} allLanes={allLanes} />
                        :null
                    }
                    {
                        alert.show ?
                        <p className='alertText'>{alert.alertText}</p>
                        :null
                    }
                </div>
            </div>
            : null
            }
            <div className='dashboardCntnr'>
                {allLanes.length>0?
                allLanes.map(lane=>
                    <div key={lane.laneId} className="lane"  onDragOver={allowDrop} onDrop={(e)=>dropCard(e, lane)}>
                        {
                            editInput.show===true && editInput.laneId === lane.laneId ?
                            <div className="flexRow justifyCntBtwn w100">
                            <form className='editForm' onSubmit={saveLaneTiltleName}>
                                <label htmlFor={lane.laneId} className='sr-only'> title </label>
                                <input className='editTitleInput' type="text" value={lane.laneTittle} id={lane.laneId} onChange={handleLaneTitleInput}/>
                            </form>
                            <button className='cancelEdit' onClick={saveLaneTiltleName}><i className="fas fa-check"></i></button>
                            <button className='cancelEdit' onClick={cancelEdit}><i className="fas fa-times"></i></button>
                        </div>
                        :

                        <div className="flexRow justifyCntBtwn w100">
                            <div>
                                <p className='laneTitle' onClick={()=>showingInputForm(lane.laneId)}>{lane.laneTittle} &nbsp;{lane.cards?`(${lane.cards.length})`:null}</p>
                            </div>
                            <button className='deleteLaneBtn' onClick={()=>deleteLane(lane.laneId)}><i className="fas fa-times"></i></button>
                        </div>
                        }
                        <button className='addCardBtn' onClick={()=>openModal('addCard', lane.laneId)}><i className="fas fa-plus"></i></button>
                        <ul className="laneContent">
                            {
                                lane.cards.length>0?
                                lane.cards.map(card=>
                                    <Cards  key={card.id}  card={card} startDragging={startDragging} showingCardMen={showingCardMenu} cardMenu={cardMenu} deleteCard={deleteCard} lane={lane} openModal={openModal} showingCardMenu ={showingCardMenu }/>
                                    )
                                : 
                                <li className='card'>No cards</li>
                            }
                            {
                                allLanes.length>1 ?
                                <li className='emptyCard'>move card here</li>
                                :null

                            }
                        </ul>
                    </div>
                )
                :
                <div className="lane">
                    <h4>there are currently no lanes</h4>
                </div>
            }
                <div className="lane">
                    <h4>create new lane</h4>
                    <button className="card" onClick={()=>openModal('addLane')}><i className="fas fa-plus"></i></button>
                </div>
            </div>
        </section>
    )
}

export default Dashboard
